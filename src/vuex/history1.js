import { Vue } from './install';
import { forEach } from './util';

class Store {
  constructor(options) {
    // let { state, getters, mutations, actions, modules, strict } = options;
    let { state, getters, mutations, actions } = options;

    this.getters = {};  //我在取getters属性时，把它代理给计算属性

    const computed = {};

    forEach(getters, (fn, key) => {
      computed[key] = () => {
        return fn(this.state);  //具备了缓存功能
      }
      console.log(computed[key])
      // 当我们去getter上取值，需要对computed取值
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key]
      })
    })
    // -----------
    this.mutations = {};
    forEach(mutations, (fn, key) => {
      // commit('changeAge', 10)
      this.mutations[key] = (payload) => fn.call(this, this.state, payload);
    })
    // -----------
    this.actions = {};
    forEach(actions, (fn, key) => {
      // commit('changeAge', 10)
      this.actions[key] = (payload) => fn.call(this, this, payload);
    })
    this._vm = new Vue({
      data: {  //$符号开头的数据不会被挂载到实例上，但是会挂载到当前的_data上，减少了一次代理
        $$state: state
      },
      computed
    })
    // 用户组件使用的$store都指的是this
  }

  // 类的属性访问器
  get state() { //defineProperty中的get
    return this._vm._data.$$state;
  }
  dispatch = (type, payload) => {
    this.actions[type](payload);
  }
  commit = (type, payload) => {
    this.mutations[type](payload);
  }
}

export default Store;