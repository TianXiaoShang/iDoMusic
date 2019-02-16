<template>
    <div class="songListWrap">
        <my-scroll :data="songListData" class="scroll-wrap" ref='scrollWrap'>
            <div class="scroll-content">
                <div class="listItem" v-for="(item,index) in songListData" :key="index">
                    <div class="coverWrap">
                        <img v-lazy="item.coverImgUrl" :key='item.coverImgUrl' alt="" class="cover">
                        <div class="filter"></div>
                        <div class="playCount" v-if="item.playCount">
                            <img src="@/assets/playcount.png" alt="" class="picon">
                            {{filterCount(item.playCount)}}
                            </div>
                        <div class="creator">
                            <img src="@/assets/creator.png" alt="" class="picon">
                            {{item.creator.nickname}}</div>
                    </div>
                    <span class="title">{{item.name}}</span>
                </div>
            </div>
            <loading v-if="loadingStatus" calss="loading"></loading>
        </my-scroll>
    </div>
</template>

<script>
import myScroll from "base/myScroll"
import loading from 'base/loading'
export default {
    name: "songList",
    props:{
        songListData:Array,
        scrollToTop:String,         //用于type改变滚动会顶端
        loadingStatus:Boolean   //用于控制loading
    },
    watch:{
        scrollToTop(){
            this.changeScrollTo()
        }
    },
    components:{
        myScroll,
        loading
    },
    methods:{
        filterCount(num){      //处理播放次数单位
            return num = num > 10000 ? parseInt(num/10000) + "万" : num
        },
        changeScrollTo(){      //切换类型后滚动到顶端
            console.log(this.$refs.scrollWrap)
            this.$refs.scrollWrap.scrollTo(0,0,200)
        }
    }

}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
.songListWrap
    position fixed
    top 134px
    bottom 0
    width 100%
    overflow hidden
    .scroll-wrap
        position relative
        overflow hidden
        height 100%
        background $themeColor
        .scroll-content
            width 100%
            background white
            .listItem
                display inline-block
                box-sizing border-box
                width 48%
                margin 2% 1%
                .coverWrap
                    position relative
                    width 100%
                    padding-top 100%
                    border-radius 5px
                    overflow hidden
                    .cover
                        position absolute 
                        left 0
                        top 0
                        width 100%
                        height 100%
                    .filter
                        position absolute
                        top 0
                        left 0
                        width 100%
                        padding-top 100%
                        background linear-gradient(to bottom, rgba(20,20,20,0.6) 0%,rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%,rgba(20,20,20,0.6) 100%);
                    .playCount
                        color white
                        position absolute
                        top 6px
                        right 6px
                        font-size 13px
                    .picon
                        width 14px
                    .creator
                        color white
                        position absolute   
                        bottom 6px
                        left 6px
                        font-size 15px
                .title
                    display inline-block
                    font-size 14px
                    line-height 20px
                    box-sizing border-box
                    width 100%
                    height 45px
                    padding 4px 6px
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; //行数
                    -webkit-box-orient: vertical;
</style>

