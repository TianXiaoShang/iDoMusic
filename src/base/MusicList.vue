<template>
    <div class="MusicList-warp">
        <my-scroll :data="songsListData" class="myScroll"  v-if="songsListData.length">
            <div class="scroll-content">
                <div class="noMore" v-if="nomore">没有为您找到相关资源~</div>
                <div class="content">
                    <div class="title">{{MusicListTitle}}</div>
                    <div class="item" v-for="(item,index) in songsListData" :key="index" @click="onClick(item.id,item.type)">
                        <div v-if="item.imageUrl" class="cover-img">
                            <img v-lazy="item.imageUrl" :key="item.imageUrl" alt="" class="item-img">
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
        
    </div>
</template>

<script>
import myScroll from 'base/myScroll'
export default {
    name:'MusicList',
    components:{
        myScroll
    },
    props:{
        songsListData:{
            type:Array
        },
        MusicListTitle:{
            type:String,
            default:''
        },
        nomore:false
    },
    methods:{
        onClick(id,type){
            console.log(id,type)
        },
    },
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
            background-image url('../assets/BgImage1.png')
            background-size cover
            .scroll-content
                padding 5px
                background white
                .noMore
                    text-align center
                    padding 10px 0
                    color #bbb
                    font-size 15px
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
                        margin-bottom 10px
                        background white
                        justify-content space-between
                        border-bottom 1px solid #eee
                        .cover-img
                            margin-left 10px
                            flex-shrink 0
                            width 50px
                            height 50px
                            overflow hidden
                            .item-img
                                height 100%
                                width 100%
                        .info
                            box-sizing border-box
                            display flex
                            height 100%
                            flex-grow 1
                            overflow hidden
                            width 100%
                            padding 0 10px
                            .song-info
                                box-sizing border-box
                                display flex
                                flex-direction column
                                height 100%
                                width 80%
                                flex-grow 1
                                justify-content center
                                margin-right 10px
                                .song-name 
                                .singer-list
                                    font-size 15px
                                    width 100%
                                    overflow hidden
                                    white-space nowrap
                                    text-overflow ellipsis
                                .singer-list
                                    margin-top 6px
                                    font-size 11px
                                    color $fontGray
                            .play
                                height 100%
                                display flex
                                align-items center
                                .play-img
                                    height 32%
                            

            
</style>
