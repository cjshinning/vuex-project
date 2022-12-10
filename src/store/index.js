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
  modules: {}
})