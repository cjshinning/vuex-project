import { Vue } from './install';

class Store {
  constructor(options) {
    // let { state, getters, mutations, actions, modules, strict } = options;
    let { state } = options;

    this._vm = new Vue({
      data: {  //$符号开头的数据不会被挂载到实例上，但是会挂载到当前的_data上，减少了一次代理
        $$state: state
      }
    })
    console.log(this._vm);

    // 用户组件使用的$store都指的是this
  }

  // // 类的属性访问器
  get state() { //defineProperty中的get
    return this._vm._data.$$state;
  }
}

export default Store;