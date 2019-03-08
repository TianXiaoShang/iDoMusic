<template>
    <div class="myScrollWrap">
      <my-scroll :data="refreshData" class="scroll-wrap" ref='scroll'>
        <div class="scroll-content">
            <Slider :params="bannerParams" :bannerData="bannerData" v-show="bannerData.length">
                <div v-for="(item,index) in bannerData" :key="index">
                    <a :href="item.url">
                        <img :src="`${item.imageUrl}?param=400y145`" @load="bannerImgLoad" alt="">
                    </a>
                </div>
            </Slider>
            <song-list v-if="recSongListData.length" :songListData='recSongListData' :titleTypeName="titleTypeName"></song-list>
            <music-list @selectTarget="selectTarget" v-if="songsListData.length" :MusicListTitle="MusicListTitle" :songsListData="songsListData"></music-list>
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
import {_creatGridData, _creatListData, filterSinger, DATA_TYPE} from 'common/js/creatListData'
import MusicList from 'base/MusicList'
import {mapActions} from 'vuex'


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
      refreshData:[],
      MusicListTitle:'iDo推荐热歌',
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
        // console.log(res)
        if (res && res.statusText === STATUS_TEXT) {
          this.bannerData = res.data.banners;
        }
      });
    },
    _getRecSongListData(){
      getRecSongListData().then(res => {
        // console.log(res)
        
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
    selectTarget(ops){            
      this.selectPlay({list:this.songsListData, index:ops.index,id:ops.id})
    },
    ...mapActions([
        'selectPlay'
    ]),
    creatGridData(data){                //创建数据格式
      var newData = []
      data.forEach((item, index) => {
          newData.push(new _creatGridData(item.picUrl, item.playCount, undefined, item.name, item.id, true,false,false,DATA_TYPE[2]))
      })
      return newData;
    },
    creatListData(data){                //创建数据格式
      var newData = [] 
      data.forEach((item, index) => {
          var album = filterSinger(item.song.artists,item.song.album.name)
          newData.push(new _creatListData(item.song.album.picUrl,  item.song.name, album, item.id ,DATA_TYPE[0]))
      })
      return newData;
    },
    bannerImgLoad(){                    //轮播图靠图片撑开高度，所以需要refresh
      if(!this.checkLoad){              //只需要执行一次即可，一张图撑开就行
        this.$refs.scroll.refresh();
        this.checkLoad = true
      }
    }
  },
  activated(){
        this.$refs.scroll.refresh()     //go(-1)后不能滚动的问题
    },
};
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
.myScrollWrap
  position fixed
  top 93px
  bottom $miniPlayerHeight
  width 100%
  .scroll-wrap
    height 100%
    overflow hidden
    background-image url('../../assets/BgImage2.png')
    background-size cover
    .scroll-content
      background white
</style>
