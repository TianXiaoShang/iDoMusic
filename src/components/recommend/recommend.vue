<template>
    <div class="myScrollWrap">
      <my-scroll :data="refreshData" class="scroll-wrap" ref='scroll'>
        <div class="scroll-content">
            <Slider :params="bannerParams" :bannerData="bannerData" v-show="bannerData.length">
                <div v-for="(item,index) in bannerData" :key="index">
                    <a :href="item.url">
                        <img :src="item.imageUrl" @load="bannerImgLoad" alt="">
                    </a>
                </div>
            </Slider>
            <song-list v-if="recSongListData.length" :songListData='recSongListData' :titleTypeName="titleTypeName"></song-list>
            <music-list v-if="songsListData.length" :songsListData="songsListData"></music-list>
        </div>
      </my-scroll>
    </div>
</template>

<script>
import { STATUS_TEXT } from "api/config"
import getBannerData from "api/recommend"
import getRecNewMusicData from "api/recNewMusic"
import Slider from "base/slider"
import myScroll from "base/myScroll"
import songList from 'base/songList'
import getRecSongListData from 'api/recSongList'
import {_creatGridData, _creatListData} from 'common/js/creatListData'
import MusicList from 'base/MusicList'


export default {
  name: "Recommend",
  components: {
    Slider,
    myScroll,
    songList,
    MusicList
  },
  data() {
    return {
      bannerData: [],
      bannerParams: {
        loop: true,     //循环滚动
        autoPlay:true,  //自动轮播
        interval: 2000  //停留时间
      },
      recSongListData:[],
      titleTypeName:"iDo推荐歌单",
      songsListData:[],
      refreshData:[]
    };
  },
  watch:{                    //监听任意数据获取到随后refresh刷新高度
    recSongListData:{
      handler(){
      this.refreshData = []
      },
      deep:true,
    },
    songsListData:{
      handler(){
      this.refreshData = []
      },
      deep:true,
    }
  },
  created() {
    this._getBannerData();           //获取banner数据
    this._getRecSongListData();      //获取推荐歌单数据
    this._getRecNewMusicData();      //获取推荐歌曲数据
  },
  methods: {
    _getBannerData() {
      getBannerData().then(res => {
        if (res && res.statusText === STATUS_TEXT) {
          this.bannerData = res.data.banners;
        }
      });
    },
    _getRecSongListData(){
      getRecSongListData().then(res => {
        if(res && res.statusText === STATUS_TEXT){
          this.recSongListData = this.creatGridData(res.data.result)
        }
      })
    },
    _getRecNewMusicData(){
      getRecNewMusicData().then( res => {
        if(res && res.statusText === STATUS_TEXT){
          this.songsListData = this.creatListData(res.data.result)
        }
      })
    },
    creatGridData(data){                //创建数据格式
      var newData = []
      data.forEach((item, index) => {
          newData.push(new _creatGridData(item.picUrl, item.playCount, undefined, item.name, item.id, true,false,false))
      })
      return newData;
    },
    creatListData(data){                //创建数据格式
      var newData = []
      data.forEach((item, index) => {
          newData.push(new _creatListData(item.song.album.picUrl,  item.song.name,item.song.artists,item.song.album.name, item.id))
      })
      return newData;
    },
    bannerImgLoad(){                    //轮播图靠图片撑开高度，所以需要refresh
      if(!this.checkLoad){              //只需要执行一次即可，一张图撑开就行
        this.$refs.scroll.refresh();
        this.checkLoad = true
      }
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
    background-image url('../../assets/BgImage1.png')
    background-size cover
    .scroll-content
      background white
</style>
