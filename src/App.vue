<template>
  <div id='app'>
      <search></search>
      <tab></tab>
      <div class="router-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      

      </div>
  </div>
</template>


<script>
import search from 'components/search/search'
import tab from 'components/tab/tab'
export default {
  name: "App",
  components: {
      search,
      tab
    }
}


</script>




<style lang="stylus">
  *
    margin 0
    padding 0
    #app
      position fixed
      top 0
      bottom 0
      width 100%
      overflow hidden
</style>
