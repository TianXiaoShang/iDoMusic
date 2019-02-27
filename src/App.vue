<template>
  <div id='app'>
      <search></search>
      <tab></tab>
      <transition :name="myFade">
        <keep-alive>
              <router-view></router-view>
        </keep-alive>
      </transition>
      <transition name="playerFade">
        <keep-alive>
              <router-view name="player"></router-view>
        </keep-alive>
      </transition>
  </div>
</template>


<script>
import search from 'components/search/search'
import tab from 'components/tab/tab'
export default {
  name: "App",
  data(){
    return {
      myFade:''
    }
  },
  components: {
      search,
      tab
  },
  watch:{
    $route(to,from){
      // if(to.meta.index === 5){
      //   this.myFade = ''
      //   return
      // }
      // if(to.meta.index === 5 || from.meta.index ===5){
      //   this.myFade = ''
      //   return
      // }
      if(to.meta.index > from.meta.index){
        this.myFade = 'slide-left';
      }else{
        this.myFade = 'slide-right';
      }
    }
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
      .slide-right-enter-active,
      .slide-right-leave-active,
      .slide-left-enter-active,
      .slide-left-leave-active {
        will-change: transform;
        transition: all 500ms;
        position: absolute;
      }
      .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%,-0, 0);
      }
      .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
      }
      .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
      }
      .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(-100%,-0, 0);
      }

      .playerFade-enter-active,
      .playerFade-leave-active {
        will-change: transform;
        transition: all 500ms;
        position: absolute;
      }
      .playerFade-enter {
        opacity: 0;
        transform: translate3d(40%,40%, 0);
      }
      .playerFade-leave-active {
        opacity: 0;
        transform: translate3d(40%, 40%, 0);
      }

</style>
