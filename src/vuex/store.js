import { forEach } from './util';
import { Vue } from './install';
import ModuleCollection from './module/module-collection';

function getNewState(store, path) {
  return path.reduce((memo, current) => {
    return memo[current];
  }, store.state)
}

function installModule(store, rootState, path, module) {
  // 需要循环当前模块的
  // module.state => 放到rootState对应的儿子里

  // 获取moduleCollection类
  let ns = store._module.getNamespaced(path);

  if (path.length > 0) {  //儿子模块
    // 需要找对对应模块，将状态声明上去
    // { name: 'jenny', age: 18, a: astate }
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    // 对象新增属性不能导致重新更新视图
    store._withCommitting(() => {
      Vue.set(parent, path[path.length - 1], module.state)
    })

    // parent[path[path.length - 1]] = module.state;
    // console.log(rootState);
  }

  module.forEachGetter((fn, key) => {
    store.wrapperGetters[ns + key] = function () {
      return fn.call(store, getNewState(store, path));
    }
  });
  module.forEachMutation((fn, key) => {
    store.mutations[ns + key] = store.mutations[ns + key] || [];
    store.mutations[ns + key].push((payload) => {
      store._withCommitting(() => {
        fn.call(store, getNewState(store, path), payload);
      })
      store._subscribe.forEach(fn => fn({ type: ns + key, payload }, store.state));
    })
  });
  module.forEachAction((fn, key) => {
    store.actions[ns + key] = store.actions[ns + key] || [];
    store.actions[ns + key].push((payload) => {
      return fn.call(store, store, payload);
    })
  });
  module.forEachChildren((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  })
}

function resetVM(store, state) {
  let oldVm = store._vm;
  store.getters = {};  //需要将模块中所有的getters，mutations，actions收集
  const computed = {};
  forEach(store.wrapperGetters, (getter, key) => {
    computed[key] = getter;
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })

  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  });

  if (store.strict) { //说明是严格模式我要监控状态
    // 如果状态更新 原则上 异步更新
    store._vm.$watch(() => store._vm._data.$$state, () => {
      // 我希望状态变化后，直接就能监控到，wacther都是异步的？状态变化会立即执行，不是异步watcher
      console.assert(store._committing, 'no mutate in mutation handler outside');
    }, { deep: true, sync: true })
  }

  if (oldVm) {  //重新创建实例后，需要将老的实例注销
    Vue.nextTick(() => {
      oldVm.$destroy();
    })
  }
}

class Store {
  constructor(options) {
    // 对用户的模块进行整合
    // {
    //   module: 对应的模块,
    //   state:xxx,
    //   children:[
    //     a:{
    //       module: 对应的模块,
    //       state:xxx,
    //       children:[]
    //     }
    //   ]
    // }

    this._module = new ModuleCollection(options);  //对用户的参数进行格式化操作
    // console.log(this._module);

    this.wrapperGetters = {};
    this.mutations = {};
    this.actions = {};

    this._subscribe = [];
    this._committing = false; //默认不是在mutation中更改的
    this.strict = options.strict;


    // 没有namespaced的时候getters都放在跟上，mutations，actions会被合并数组
    let state = options.state;
    installModule(this, state, [], this._module.root);

    resetVM(this, state);
    if (options.plugins) {
      options.plugins.forEach(plugin => plugin(this));
    }
  }
  _withCommitting(fn) {
    this._committing = true;  //如果是true
    fn(); //函数是同步的，获取_committing就是true，如果是异步的就会变成false，就会打印日志
    this._committing = false;
  }
  subscribe(fn) {
    this._subscribe.push(fn);
  }
  replaceState(newState) {
    this._withCommitting(() => {
      this._vm._data.$$state = newState;  //替换最新的状态
    })
  }
  get state() {
    return this._vm._data.$$state;
  }
  commit = (mutationName, payload) => {
    this.mutations[mutationName] && this.mutations[mutationName].forEach(fn => fn(payload));
  }
  dispatch = (actionName, payload) => {
    this.actions[actionName] && this.mutations[actionName].forEach(fn => fn(payload));
  }

  registerModule(path, module) {  //最终都转成数组
    if (typeof path == 'string') path = [path];
    this._module.register(path, module);

    // 将用户的module 重新安装，虽然重新安装了，只解决了状态问题，但是computed丢失了
    installModule(this, this.state, path, module.newModule);

    resetVM(this, this.state);
  }
}

export default Store;