<template>
    <div class="wrap">
        <div class="player" v-for="(item, index) in musicData" :key="index">
            <div class="background-image">
                <img v-lazy="item.al.picUrl" alt="" class="bg-img">
                <div class="bg-filter"></div>
            </div>
            <div class="title">
                <div class="back">
                    <img src="@/assets/backWhite.png" alt="" class="back-icon" @click="backClick">
                </div>
            </div>
            <div class="cover">
                <div class="border">
                    <img v-lazy="item.al.picUrl" alt="" class="img">
                </div>
            </div>
            <div class="music-detail">
                <div class="music-name">{{item.name}}</div>
                <div class="music-info">
                    <div class="singer-name">{{'演唱：'+filterArtist(item.ar)}}</div>
                    <div class="singer-ablum">{{'专辑：' + item.al.name}}</div>
                </div>
            </div>
            <div class="controls">
                <img src="@/assets/model1.png" alt="" class="model">
                <img src="@/assets/previous.png" alt="" class="previous">
                <img src="@/assets/play.png" alt="" class="play">
                <img src="@/assets/next.png" alt="" class="next">
                <img src="@/assets/list.png" alt="" class="list">
            </div>
        </div>
    </div>
</template>


<script>
import {getMusicDetailData, getMusicUrlData, getMusicLyricData} from 'api/music'
import {STATUS_TEXT} from 'api/config'

export default {
    name:'Player',
    data(){
      return {
          musicData:[]
      }  
    },
    activated(){
        this._getMusicData()
        console.log(this.musicData)
    },
    deactivated(){
        this.musicData =[]
    },
    methods:{
        _getMusicData(){
            var id = this.$route.params.id
            if(id){
                getMusicDetailData(id).then(res => {
                    console.log(res)
                    if(res && res.statusText === STATUS_TEXT){
                        this.musicData = res.data.songs.splice(0,1)
                        console.log(this.musicData)
                    }
                })
                // getMusicUrlData(id).then(res => {
                //     console.log(res)
                // })
                // getMusicLyricData(id).then(res => {
                //     console.log(res)
                // })
            }
        },
        filterArtist(arr){
            var newArr = []
            arr.forEach(item => {
                newArr.push(item.name)
            })
            return newArr.join('/')
        },
        backClick(){
            this.$router.go(-1)
        }
    }
}
</script>


<style lang="stylus" scoped>
@import "~common/styles/variable"
.wrap
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 998
    background-image url('../../assets/BgImage1.png')
    background #eee
    .player
        width 100%
        height 100%
        background black
        .background-image
            position relative
            width 100%
            height 100%
            .bg-filter
                position absolute
                top 0
                left 0
                bottom 0
                right 0
                // background linear-gradient(to bottom, rgba(99,64,74,0.8) 0%,rgba(99,64,74,0.6) 20%,rgba(99,64,74,0.7) 40%,rgba(99,64,74,0.85) 50%,rgba(99,64,74,0.95) 70%,rgba(99,64,74,1) 100%);
            .bg-img
                position absolute
                left -50%
                // transform translate(-50%)
                filter blur(4px) opacity(38%)
                top -5px      //用于隐藏高斯模糊边上的黑边
                height 102%   //用于隐藏高斯模糊边上的黑边
        .title
            width 100%
            height 28px
            padding 10px
            position absolute 
            top 0
            left 0
            z-index 500
            .back
                width 100%
                height 100%
                .back-icon
                    height 100%
        .cover
            box-sizing border-box
            position absolute 
            left 50%
            top 120px
            transform translate(-50% - 4px)
            width 65%
            .border
                width 100%
                height 0
                padding-bottom 100%
                border-radius 50%
                border 8px solid rgba(200,200,200,0.5)
                overflow hidden
                .img
                    width 100%
        .music-detail
            position absolute
            left 0
            top 0
            bottom 0
            right 0
            color white
            .music-name
                position absolute
                width 100%
                padding 0 15px
                top 60px
                text-align center
                font-size 18px
                // font-weight 600
                // color $themeColor
                // text-shadow 1px 1px 1px white
            .music-info
                position absolute 
                width 100%
                text-align center
                bottom 140px
                font-size 16px
                color #ccc
                .singer-name
                    padding 0 15px
                .singer-ablum
                    padding 0 15px
                    font-size 16px
                    margin-top 10px
        .controls
            position absolute 
            bottom 40px
            display flex
            width 100%
            height 60px
            justify-content space-around
            align-items center
            & img 
                width 50px

</style>
