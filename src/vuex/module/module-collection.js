import { forEach } from '../util';
import Module from './module';

class ModuleCollection {
  constructor(options) {
    // 对数据进行格式化操作
    // watcher => 【渲染watcher -> 计算属性watcher】
    this.root = null;
    this.register([], options);
  }
  register(path, rawModule) {
    let newModule = new Module(rawModule);

    if (path.length === 0) {
      this.root = newModule;
    } else {
      // [a] [a,c] [a,c,e,d]
      // 找父亲
      let parent = path.slice(0, -1).reduce((memo, current) => {
        // return memo._children[current]
        return memo.getChild(current);
      }, this.root);

      // parent._children[path[path.length - 1]] = newModule;
      parent.addChild(path[path.length - 1], newModule);

      // 根据当前注册的key，将他注册到对应的模块的儿子处
    }
    // 注册完毕当前模块，再进行注册跟模块
    if (rawModule.modules) {
      forEach(rawModule.modules, (module, key) => {
        // console.log(module, key);
        // []
        // [a]
        // [b]
        // [a,c]
        this.register(path.concat(key), module);
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
