export let Vue;

function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      // 获取根组件上的store，将他共享给其他人
      let options = this.$options;
      if (options.store) {
        this.$store = options.store;
      } else {
        if (this.$parent && this.$parent.$store) {
          this.$store = this.$parent.$store;
        }
      }
    }
  })
}

export default install;