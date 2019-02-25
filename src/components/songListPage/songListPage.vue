<template>
    <div class="songListPage-wrap">
        <div class="list-detail-content" >
            <div class="fliterCover" ref="fliterCover" :key="this.$route.params.id"></div>
            <div class="title">
                <img src="@/assets/back.png" alt="" class="back-icon" @click="onBack">
            </div>

            <div class="info">
                <div class="cover">
                    <img v-lazy="infoData.img" :key="infoData.img" alt="" class="cover-image">
                    <div class="cover-filter" v-if="infoData.playCount"></div>
                    <div v-if="infoData.playCount" class="play-count">{{filterCount(infoData.playCount)}}</div>
                </div>
                <div class="info-detail" v-if="infoData.name">
                    <div class="name">{{infoData.name}}</div>
                    <my-scroll class="myScroll" :data="scrollArr">
                        <div class="more">{{infoData.description}}</div>
                    </my-scroll>
                </div>
            </div>
            <div class="radius"></div>
        </div>
        <music-list class="musicList" :songsListData="songListData"></music-list>
        <loading v-if="loadingStatus" :opacity="opacity"></loading>
    </div>
    
</template>


<script>
import {getMixListData, getRankListData, getSingerListData} from 'api/songList'
import { _creatListData,filterSinger, DATA_TYPE} from 'common/js/creatListData'
import MusicList from 'base/MusicList'
import { STATUS_TEXT } from "api/config"
import myScroll from 'base/myScroll'
import loading from 'base/loading'

export default {
    name:"SongListPage",
    components:{
        myScroll,
        MusicList,
        loading
    },
    data(){
        return {
            creatDataArr:[this.mixData, this.rankData, this.SingerData],
            infoData:{img:'',name:'',description:'',playCount:''},
            songListData:[],
            scrollArr:[],
            loadingStatus:false,
            opacity:0
        }
    },
    watch:{
        infoData(){
            this.scrollArr = []
        }
    },
    activated(){
        this.id = this.$route.params.id
        this.type = this.$route.params.type
        this._getListData(this.id,this.type)
    },
    deactivated(){
        this.infoData = {img:'',name:'',description:'',playCount:''},
        this.songListData = []
    },
    methods:{
        _getListData(id,type){
            this.loadingStatus = true
            var getArr = [getMixListData, getRankListData, getSingerListData]
            var typeArr = ['Mix', 'Rank', 'Singer']
            var index = typeArr.findIndex(item => {
                return type === item
            })
            getArr[index](id).then(res => {
                if(res && STATUS_TEXT === res.statusText){
                    this.songListData = this.creatDataArr[index](res)
                    this.$refs.fliterCover.style.backgroundImage = `url(${this.infoData.img})`
                    this.loadingStatus = false
                }
            })
        },
        onBack(){
            this.$router.go(-1)
        },
        mixData(data){
            return this.rankData(data)        //歌单跟排行返回的数据格式一致
        },
        rankData(data){
            data = data.data.playlist
            this.infoData = {
                img:data.coverImgUrl,
                name:data.name,
                playCount:data.playCount,
                description:data.description
            }
            var newArr = []
            data.tracks.forEach((item,index) => {
                var album = filterSinger(item.ar,item.al.name)
                newArr.push(new  _creatListData(item.al.picUrl,  item.name, album, item.id ,DATA_TYPE[0]))
            }) 
            return newArr
        },
        SingerData(data){
            data = data.data
            this.infoData = {
                img:data.artist.img1v1Url,
                name:data.artist.name,
                playCount:undefined,
                description:data.artist.briefDesc
            }
            var newArr = []
            data.hotSongs.forEach((item,index) => {
                var album = filterSinger(item.ar,item.al.name)
                newArr.push(new  _creatListData(item.al.picUrl,  item.name, album, item.id ,DATA_TYPE[0]))
            }) 
            return newArr
        },
        filterCount(count){
            if(count && count > 10000){
                return ((count / 10000) | 0) +'万'
            }
        }
    }
}
</script>


<style lang="stylus" scoped>4
@import '~common/styles/variable'
 
.songListPage-wrap
    position fixed
    left 0
    top 0
    bottom 0
    right 0
    background white
    .musicList
        position absolute 
        top 199px
        bottom 0
        width 100%
    .list-detail-content
        position relative
        width 100%
        height 200px
        overflow hidden
        .fliterCover
            position absolute 
            top 0
            left 0
            right 0
            bottom 0
            filter blur(18px) opacity(80%)
            background-size 100% 100%
            background-repeat no-repeat
            background-color #EC3A3E
        .title
            position absolute 
            box-sizing border-box
            top 0
            left 0
            padding 10px 5px
            width 100%
            height 46px
            .back-icon
                position relative
                z-index 991
                height 100%
        .info
            display flex
            position absolute
            top 40px
            width 100%
            align-items center
            .cover
                position relative
                flex-shrink 0
                width 110px
                margin-left 10px
                .cover-image
                    width 100%
                .cover-filter
                    position absolute
                    top 0
                    left 0
                    bottom 0
                    right 0
                    background linear-gradient(to bottom, rgba(20,20,20,0.6) 0%,rgba(0,0,0,0) 25%);
                .play-count
                    position absolute
                    right 3px
                    top 3px
                    font-size 12px
                    color white
                .play-count:before
                    position absolute 
                    left -18px
                    top 3px 
                    content ''
                    display block
                    width 14px
                    height 14px
                    background-image url('../../assets/playcount.png')
                    background-size contain
                    background-repeat no-repeat
            .info-detail
                flex-grow 1
                margin 8px 10px
                background rgba(255,255,255,0.6)
                padding 5px 10px
                border-radius 5px
                .name
                    font-size 17px
                    font-weight 600
                    color $themeColor
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; //行数
                    -webkit-box-orient: vertical;
                .myScroll
                    margin-top 3px
                    height 60px
                    overflow hidden
                    word-wrap break-word
                    .more
                        font-size 14px
                        // word-wrap break-word
        .radius
            position absolute 
            bottom -25px
            width 100%
            height 50px
            border-radius 50%
            background white


</style>
