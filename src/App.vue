<template>
  <div id="app">
    我的名字是：{{ this.$store.state.name }}，年龄：{{ this.$store.state.age }}<br />
    我的真实年龄是：{{ this.$store.getters.myAge }}<br />
    我的真实年龄是：{{ this.$store.getters.myAge }}

    <button @click="$store.commit('changeAge', 10)">修改年龄</button>
    <button @click="$store.dispatch('changeAgeAsync', 10)">异步年龄</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    console.log(this.$store);
  }
}
</script>

<style>

</style>
