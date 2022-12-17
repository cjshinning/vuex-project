<template>
  <!-- <div id="app"></div> -->
  <div id="app">
    我的名字是：{{ this.$store.state.name }}，年龄：{{ this.$store.state.age }}<br />
    我的真实年龄是：{{ this.$store.getters.myAge }}<br />
    我的真实年龄是：{{ this.$store.getters.myAge }}

    <button @click="$store.commit('changeAge', 10)">修改年龄</button>
    <button @click="$store.dispatch('changeAgeAsync', 10)">异步年龄</button>

    <hr>

    t1的姓名：{{ this.$store.state.a.name }}，t1的年龄：{{ this.$store.state.a.age }}<br />
    t1的计算年龄：{{ this.$store.getters['a/myAge'] }}
    <button @click="$store.commit('a/changeAge', 10)">t1更改年龄</button>

    <hr>

    c的年龄：{{ this.$store.state.a.c.age }}
    <button @click="$store.commit('a/c/changeAge', 10)">c更改年龄</button>

    <hr>
    <button @click="registerModule">动态注册模块</button>
    b模块：{{ this.$store.state.b && this.$store.state.b.name }} {{ this.$store.state.b && this.$store.state.b.age
    }}
    {{ this.$store.getters.bAge && this.$store.getters.bAge }}
  </div>
</template>

<script>
import store from './store';
export default {
  name: 'app',
  methods: {
    registerModule() {
      store.registerModule('b', {
        state: {
          name: 'Jane',
          age: 30
        },
        getters: {
          bAge(state) {
            return state.age + 1;
          }
        }
      })
    }
  },
  mounted() {
    // console.log(this.$store);
  }
}
</script>

<style>

</style>
