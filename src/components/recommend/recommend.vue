<template>
    <div class="myScrollWrap">
      <my-scroll :data="bannerData" class="scroll-wrap">
        <div class="scroll-content">
            <Slider :params="params" :bannerData="bannerData">
                <div v-for="(item,index) in bannerData" :key="index">
                    <a :href="item.url">
                        <img :src="item.imageUrl" alt="">
                    </a>
                </div>
            </Slider>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            1111
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            1111<br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            1111
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            1111
        </div>
      </my-scroll>
    </div>
</template>

<script>
import { STATUS_TEXT } from "api/config";
import getRecommendData from "api/recommend";
import Slider from "base/slider";
import myScroll from "base/myScroll"

export default {
  name: "Recommend",
  components: {
    Slider,
    myScroll
  },
  data() {
    return {
      bannerData: [],
      params: {
        loop: true,     //循环滚动
        autoPlay:true,  //自动轮播
        interval: 2000  //停留时间
      }
    };
  },
  created() {
    // setTimeout( () =>  this._getRecomendData(),2000)
    this._getRecomendData();         //获取banner数据
  },
  methods: {
    _getRecomendData() {
      getRecommendData().then(res => {
        if (res && res.statusText === STATUS_TEXT) {
          this.bannerData = res.data.banners;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
.myScrollWrap
  position fixed
  top 93px
  bottom 0
  width 100%
  .scroll-wrap
    height 100%
    overflow hidden
    background $themeColor
    .scroll-content
      background white
</style>
