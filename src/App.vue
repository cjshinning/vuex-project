<template>
  <!-- <div id="app"></div> -->
  <div id="app">
    我的名字是：{{ name }}<br />
    我的真实年龄是：{{ myAge }}<br />

    <button @click="$store.commit('changeAge', 10)">修改年龄</button>
    <button @click="$store.dispatch('changeAgeAsync', 10)">异步年龄</button>

  </div>
</template>

<script>
// import store from './store';
// import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { mapState, mapGetters, mapMutations, mapActions } from './vuex/index';


export default {
  name: 'app',
  methods: {
    ...mapMutations(['changeAge']),
    ...mapActions(['changeAgeAsync'])
    // changeAge(payload) {
    //   this.$store.commit('changeAge', payload);
    // },
    // changeAgeAsync(payload) {
    //   this.$store.dispatch('changeAge', payload);
    // },
  },
  computed: {
    ...mapState(['name']),  //mapXxx返回的是对象
    ...mapGetters(['myAge'])
    // name() {
    //   return this.$store.state.name;
    // },
    // myAge() {
    //   return this.$store.getters.myAge;
    // }
  }
  // methods: {
  //   registerModule() {
  //     store.registerModule('b', {
  //       state: {
  //         name: 'Jane',
  //         age: 30
  //       },
  //       getters: {
  //         bAge(state) {
  //           return state.age + 1;
  //         }
  //       }
  //     })
  //   }
  // },
  // mounted() {
  //   // console.log(this.$store);
  // }
}
</script>

<style>

</style>
