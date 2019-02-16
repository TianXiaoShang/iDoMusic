<template>
    <div class="rankWrap">
        <my-scroll :data="rankDataMore" class="scroll-wrap">
            <div class="scroll-content">
                <div class="rank-list-wrap">
                    <div class="rank-type-name">iDo官方榜</div>
                    <div class="content-wrap">
                        <div class="rank-item" v-for="(item,index) in rankDataDetail" :key="index">
                            <div class="item-cover">
                                <img :src="item.coverImgUrl" alt="" class="cover-img">
                                <div class="filter"></div>
                                <div class="update-time">{{item.updateFrequency}}</div>
                            </div>
                            <div class="item-content">
                                <div class="content-item" v-for="(item,index) in item.tracks" :key="index">
                                    <div class="songDetail">{{filterSong(index,item.first,item.second)}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <grid-list :data="rankDataMore" :typeName="typeName"></grid-list>
            </div>
        </my-scroll>

        <!-- 1111 -->
    </div>
</template>

<script>
import getRankData from "api/rank"
import gridList from "base/gridList"
import { STATUS_TEXT } from "api/config"
import myScroll from "base/myScroll"

export default {
    name:"Rank",
    data(){
        return {
            rankDataDetail:[],
            rankDataMore:[],
            typeName:'iDo全球榜'
        }
    },
    components:{
        gridList,
        myScroll
    },
    created(){
        this._getRankData()
    },
    methods:{
        _getRankData(){
            getRankData().then(res => this._handleRankData(res))
        },
        _handleRankData(res){
            console.log(res.data.list)
            if(res && res.statusText === STATUS_TEXT){
                this.rankDataDetail = res.data.list.splice(0,4)
                this.rankDataMore = res.data.list
                console.log(this.rankDataMore)
            }
        },
        filterSong(index,first,second){
            var str = index+1+'.' + first + '-' + second
            return str
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable" 
    .rankWrap
        position fixed
        top 94px
        bottom 0
        width 100%
        .scroll-wrap
            width 100%
            height 100%
            overflow hidden
            background $themeColor
            .rank-list-wrap
                padding 0 8px
                padding-top 12px
                width 100%
                background white
                box-sizing border-box
                .rank-type-name
                    font-size 18px
                    margin 0 0 8px 8px
                .content-wrap
                    width 100%
                    .rank-item
                        display flex
                        width 100%
                        padding-bottom 5px
                        .item-cover
                            position relative
                            width 28%
                            min-width 28%
                            height 0
                            padding-bottom 28%
                            overflow hidden
                            border-radius 4px
                            .cover-img
                                width 100%
                            .filter
                                width 100%
                                height 100%
                                position absolute 
                                left 0
                                top 0
                                background linear-gradient(to bottom, rgba(0,0,0,0) 75%,rgba(20,20,20,0.4) 100%);
                            .update-time
                                position absolute 
                                bottom 5px
                                left 5px
                                font-size 12px
                                color white
                        .item-content
                            box-sizing border-box
                            display flex
                            flex-direction column
                            justify-content center
                            padding-left 10px
                            flex-grow 1
                            // background #eee
                            border-bottom 1px solid #eee
                            
                            overflow hidden
                            .content-item
                                width 100%
                                .songDetail
                                    width 100%
                                    font-size 14px
                                    line-height 28px
                                    color $fontGray
                                    white-space nowrap
                                    overflow hidden
                                    text-overflow ellipsis


3
</style>
