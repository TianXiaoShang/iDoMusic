<template>
    <div class="MusicList-warp">
        <my-scroll ref="myScroll" :data="songsListData" class="myScroll"  v-show="songsListData.length">
            <div class="scroll-content">
                <div class="content">
                    <div class="title">{{MusicListTitle}}</div>
                    <div class="item" v-for="(item,index) in songsListData" :key="index" @click="onClick(item.id,item.type,index)">
                        <div v-if="item.imageUrl" class="cover-img">
                            <img v-lazy="`${item.imageUrl}?param=60y60`" :key="item.imageUrl" alt="" class="item-img">
                        </div>
                        <div class="info">
                            <div class="song-info">
                                <div class="song-name">{{item.name}}</div>
                                <div v-if="item.album" class="singer-list">{{item.album}}</div>
                            </div>
                            <div class="play">
                                <img src="@/assets/listPlayIcon.png" alt="" class="play-img">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </my-scroll>
        <loading :opacity="opacity" v-show="loadingStatus"></loading>
    </div>
</template>

<script>
import myScroll from 'base/myScroll'
import loading from "base/loading"


export default {
    name:'MusicList',
    components:{
        myScroll,
        loading
    },
    data(){
        return {
            opacity:0,
        }
    },
    props:{
        songsListData:{
            type:Array
        },
        MusicListTitle:{
            type:String,
            default:''
        },
        loadingStatus:Boolean
    },
    methods:{
        onClick(id,type,index){
            this.$emit('selectTarget',{id,type,index})
        },
        scrollTo(){
            // this.$refs.myScroll.scrollTo(...arguments)   //都行
            this.$refs.myScroll.scrollTo.call(null,...arguments)   //都行
            
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
    .MusicList-warp
        width 100%
        .myScroll
            width 100%
            height 100%
            overflow hidden
            background white
            .scroll-content
                width 100%
                min-height 100%
                padding 5px 0 0 0
                background white
                .content
                    width 100%
                    .title
                        font-weight 600
                        margin 8px 16px 10px 16px
                        font-size 18px
                    .item
                        width 100%
                        height 50px
                        display flex
                        align-items center
                        margin-top 10px
                        background white
                        box-sizing border-box
                        justify-content space-between
                        border-bottom 1px solid #eee
                        .cover-img
                            flex-shrink 0
                            .item-img
                                margin-left 10px
                                width 50px
                                height 50px
                        .info
                            display flex
                            box-sizing border-box
                            height 100%
                            width 100%
                            flex-grow 1
                            overflow hidden
                            .song-info
                                width 90%
                                box-sizing border-box
                                display flex
                                flex-direction column
                                // flex-basis 50%
                                // flex-grow 1
                                justify-content center
                                overflow hidden
                                .song-name 
                                .singer-list
                                    padding 0 10px
                                    font-size 15px
                                    width 90%
                                    overflow hidden
                                    white-space nowrap
                                    text-overflow ellipsis
                                .singer-list
                                    margin-top 6px
                                    font-size 11px
                                    color $fontGray
                            .play
                                flex-shrink 0
                                width 10%
                                display flex
                                align-items center
                                .play-img
                                    width 20px

            
</style>
