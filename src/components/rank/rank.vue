<template>
    <div class="rankWrap">
        <my-scroll :data="rankDataMore" class="scroll-wrap" ref="myScroll">
            <div class="scroll-content">
                <div class="rank-list-wrap" v-if="rankDataDetail.length">
                    <div class="rank-type-name">iDo官方榜</div>
                    <div class="content-wrap">
                        <div 
                        class="rank-item" 
                        v-for="(item,index) in rankDataDetail" 
                        :key="index" 
                        @click="onClick(item.id)"
                        >
                            <div class="item-cover">
                                <img v-lazy="`${item.coverImgUrl}?param=140y140`" alt="" class="cover-img">
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
                <song-list 
                :songListData="rankDataMore" 
                :titleTypeName="titleTypeName"
                :dataType="dataType"
                ></song-list>
            </div>
            <loading v-if="loadingStatus"></loading>
        </my-scroll>
    </div>
</template>

<script>
import getRankData from "api/rank"
import songList from "base/songList"
import { STATUS_TEXT } from "api/config"
import myScroll from "base/myScroll"
import loading from 'base/loading'
import {_creatGridData} from "common/js/creatListData"

export default {
    name:"Rank",
    data(){
        return {
            rankDataDetail:[],
            rankDataMore:[],
            titleTypeName:"iDo全球榜",
            loadingStatus:false,
            dataType:"Rank"
        }
    },
    components:{
        songList,
        myScroll,
        loading
    },
    created(){
        this._getRankData()
    },
    activated(){
        this.$refs.myScroll.refresh()
    },
    methods:{
        _getRankData(){
            this.loadingStatus = true
            getRankData().then(res => this._handleRankData(res))
        },
        _handleRankData(res){
            if(res && res.statusText === STATUS_TEXT){
                this.rankDataDetail = res.data.list.splice(0,4)
                this.rankDataMore = this.creatData(res.data.list)
                this.loadingStatus = false
            }
        },
        filterSong(index,first,second){
            var str = index+1+'.' + first + '-' + second
            return str
        },
        creatData(data){
            var newData = []
            data.forEach((item, index) => {
                newData.push(new _creatGridData(item.coverImgUrl, item.playCount, item.updateFrequency, item.name, item.id, true,true,false,'rank'))
            })
            return newData;
        },
        onClick(id){ //点击官方榜
            this.$router.push({
                    name:'songListPage',
                    params:{
                        type:this.dataType,
                        id:id
                    }
                })
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable" 
    .rankWrap
        position fixed
        top 94px
        bottom $miniPlayerHeight
        width 100%
        .scroll-wrap
            width 100%
            height 100%
            overflow hidden
            background-image url('../../assets/BgImage1.png')
            background-size cover
            .rank-list-wrap
                padding 0 8px
                width 100%
                background white
                box-sizing border-box
                .rank-type-name
                    font-weight 600
                    padding-top 12px
                    font-size 16px
                    margin 0 8px 8px 8px 
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
                                    font-size 13px
                                    line-height 28px
                                    color $fontGray
                                    white-space nowrap
                                    overflow hidden
                                    text-overflow ellipsis
</style>
