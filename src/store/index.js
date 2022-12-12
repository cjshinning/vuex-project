import Vue from 'vue';
import Vuex from '@/vuex';
// import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: 'Jenny',
    age: 18
  },
  getters: {
    myAge(state) {
      console.log('ok');
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
        }
      }
    },
    b: {
      state: {
        name: 't2',
        age: 20
      }
    }
  }
})