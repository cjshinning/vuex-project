import Vue from 'vue';
// import Vuex from '@/vuex';
import Vuex from 'vuex';
// import logger from 'vuex/dist/logger';

Vue.use(Vuex);

// function logger() {
//   return function (store) {
//     let prevState = JSON.stringify(store.state);
//     store.subscribe((mutation, state) => {   //所有的更新操作都基于mutation
//       // 如果直接手动的更改状态 此subscribe是不会执行的 commit()
//       console.log('prevState: ' + prevState);
//       console.log('mutation: ' + JSON.stringify(mutation));
//       console.log('currentState: ' + JSON.stringify(state));
//       prevState = JSON.stringify(state);
//     })
//   }
// }

function persists() {
  return function (store) { //vuex-persists
    let localState = JSON.parse(localStorage.getItem('VUEX:STATE'));
    if (localState) {
      store.replaceState(localState);
    }

    store.subscribe((mutation, rootState) => {
      // 状态发生变化就存localStorage
      // 防抖
      localStorage.setItem('VUEX:STATE', JSON.stringify(rootState));
    })
  }
}

export default new Vuex.Store({
  plugins: [
    // logger()
    persists()
  ],
  state: {
    name: 'Jenny',
    age: 18
  },
  getters: {
    myAge(state) {
      // console.log('ok');
      return state.age + 10;
    }
  },
  mutations: {
    changeAge(state, payload) {
      state.age += payload;
    }
  },
  actions: {
    changeAgeAsync({ commit }, payload) {
      setTimeout(() => {
        commit('changeAge', payload)
      }, 1000)
    }
  },
  strict: true,
  modules: {  //进行模块分割
    a: {
      namespaced: true,
      state: {
        name: 't1',
        age: 10
      },
      getters: {
        myAge(state) {
          return state.age + 20;
        }
      },
      mutations: {
        changeAge(state, payload) {
          state.age += payload;
        }
      },
      modules: {
        c: {
          namespaced: true,
          state: {
            age: 100
          },
          mutations: {
            changeAge(state, payload) {
              state.age += payload;
            }
          },
          // modules: {
          //   d: {
          //     namespaced: true,
          //     state: {
          //       age: 10
          //     }
          //   }
          // }
        }
      }
    },
    b: {
      namespaced: true,
      state: {
        name: 't2',
        age: 20
      }
    }
  }
})