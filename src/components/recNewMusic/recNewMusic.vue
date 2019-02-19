<template>
    <div class="recNewMusic-warp">
        <div class="content">
            <div class="title">iDo推荐热歌</div>
            <div class="item" v-for="(item,index) in songsListData" :key="index" @click="onClick(item.songId)">
                <img :src="item.imageUrl" alt="" class="cover-img">
                <div class="info">
                    <div class="song-info">
                        <div class="song-name">{{item.songName}}</div>
                        <div class="singer-list">{{filterSinger(item.album,item.singerName)}}</div>
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
    name:'RecNewMusic',
    props:{
        songsListData:Array
    },
    methods:{
        onClick(id){
            console.log(id)
        },
        filterSinger(alboum,singer){
            var singerArr = []
            singer.forEach((item) => {
                singerArr.push(item.name)
            })
            var str = singerArr.join('/') + ' - ' + alboum
            return str
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
    .recNewMusic-warp
        border-top 1px solid #eee
        width 100%
        padding 5px 0px 0 0
        .content
            width 100%
            .title
                font-weight 600
                margin 8px 16px 10px 16px
                font-size 18px
            .item
                width 100%
                height 70px
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
