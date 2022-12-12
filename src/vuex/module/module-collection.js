import { forEach } from '../util';

class ModuleCollection {
  constructor(options) {
    // 对数据进行格式化操作
    // watcher => 【渲染watcher -> 计算属性watcher】
    this.root = null;
    this.register([], options);
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }
    if (path.length === 0) {
      this.root = newModule;
    }
    if (rootModule.modules) {
      forEach(rootModule.modules, (module, key) => {
        console.log(module, key);
      })
    }
  }
}

export default ModuleCollection;

// this.root = {
//   _raw: 用户定义的模块,
//   state: 当前模块自己的状态,
//   _children: { //孩子列表
//     a: {
//       _raw: 用户定义的模块,
//       state: 当前模块自己的状态,
//       _children: {  //孩子列表
//         e: {}
//       }
//     },
//     c: {}
//   }
// }
