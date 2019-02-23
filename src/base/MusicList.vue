<template>
    <div class="MusicList-warp">
        <div class="noMore" v-if="nomore">没有为您找到相关资源~</div>
        <div class="content">
            <div class="title">{{MusicListTitle}}</div>
            <div class="item" v-for="(item,index) in songsListData" :key="index" @click="onClick(item.id,item.type)">
                <img v-if="item.imageUrl" v-lazy="item.imageUrl" alt="" class="cover-img">
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
</template>

<script>
export default {
    name:'MusicList',
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
        border-top 1px solid #eee
        width 100%
        padding 5px 0px 5px 5px
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
                height 60px
                display flex
                align-items center
                margin-bottom 10px
                background white
                justify-content space-between
                border-bottom 1px solid #eee
                .cover-img
                    margin-left 10px
                    height 100%
                .info
                    box-sizing border-box
                    display flex
                    height 100%
                    flex-grow 1
                    overflow hidden
                    width 100%
                    padding 0 20px 0 10px
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
