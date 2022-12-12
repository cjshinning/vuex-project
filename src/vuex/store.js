import { Vue } from './install';
import { forEach } from './util';
import ModuleCollection from './module/module-collection';

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

    let r = new ModuleCollection(options);  //对用户的参数进行格式化操作
  }

}

export default Store;