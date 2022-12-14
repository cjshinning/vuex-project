import ModuleCollection from './module/module-collection';

function installModule(store, path, module) {
  // 需要循环当前模块的
  module.forEachGetter((fn, key) => {
    store.getters[key] = function () {
      return fn.call(store, module.state);
    }
  });
  module.forEachMutation((fn, key) => {
    store.mutations[key] = store.mutations[key] || [];
    store.mutations[key].push((payload) => {
      return fn.call(store, module.state, payload);
    })
  });
  module.forEachAction((fn, key) => {
    store.actions[key] = store.actions[key] || [];
    store.actions[key].push((payload) => {
      return fn.call(store, store, payload);
    })
  });
  module.forEachChildren((child, key) => {
    installModule(store, path.concat(key), child);
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

    this.getters = {};  //需要将模块中所有的getters，mutations，actions收集
    this.mutations = {};
    this.actions = {};

    // 没有namespaced的时候getters都放在跟上，mutations，actions会被合并数组
    installModule(this, [], this._module.root);
    console.log(this.getters, this.mutations, this.actions);
  }

}

export default Store;