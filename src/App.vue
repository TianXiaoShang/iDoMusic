<template>
  <div id='app'>
      <search></search>
      <tab></tab>
      <transition :name="myFade">
        <keep-alive>
              <router-view></router-view>
        </keep-alive>
      </transition>
      <player></player>
      
  </div>
</template>


<script>
import search from 'components/search/search'
import tab from 'components/tab/tab'
import player from 'components/player/player'

export default {
  name: "App",
  data(){
    return {
      myFade:''
    }
  },
  components: {
      search,
      tab,
      player
  },
  watch:{
    $route(to,from){                 //动画判断
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
    body
      height 100%
      overflow hidden
      width 100%
      position fixed
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
</style>
