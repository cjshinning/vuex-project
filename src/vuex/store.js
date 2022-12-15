import { forEach } from './util';
import { Vue } from './install';
import ModuleCollection from './module/module-collection';

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
    Vue.set(parent, path[path.length - 1], module.state)
    // parent[path[path.length - 1]] = module.state;
    console.log(rootState);
  }

  module.forEachGetter((fn, key) => {
    store.wrapperGetters[ns + key] = function () {
      return fn.call(store, module.state);
    }
  });
  module.forEachMutation((fn, key) => {
    store.mutations[ns + key] = store.mutations[ns + key] || [];
    store.mutations[ns + key].push((payload) => {
      return fn.call(store, module.state, payload);
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
    console.log(this._module);

    this.wrapperGetters = {};
    this.getters = {};  //需要将模块中所有的getters，mutations，actions收集
    this.mutations = {};
    this.actions = {};

    const computed = {};

    // 没有namespaced的时候getters都放在跟上，mutations，actions会被合并数组
    let state = options.state;
    installModule(this, state, [], this._module.root);
    forEach(this.wrapperGetters, (getter, key) => {
      computed[key] = getter;
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key]
      })
    })
    this._vm = new Vue({
      data: {
        $$state: state
      },
      computed
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
}

export default Store;