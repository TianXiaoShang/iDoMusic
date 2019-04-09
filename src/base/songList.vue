<template>
    <div class="songListWrap">
        <div class="song-type-name" v-if="songListData.length">{{titleTypeName}}</div>
        <div class="list-content">
            <div 
            class="listItem" 
            v-for="(item,index) in songListData" 
            :key="index"
            :style="myStyle"
            @click="myClick(item.id)" 
            >
                <div class="coverWrap">
                    <img v-lazy="`${item.imageUrl}?param=140y140`" :key='item.imageUrl' alt="" class="cover">
                    <div class="filter"></div>
                    <div class="playCount" v-if="item.showPlayCount">
                        <img src="@/assets/playcount.png" alt="" class="picon">
                        {{filterCount(item.playCount)}}
                        </div>
                    <div v-if="item.showTitle" class="creator">
                        <img v-if="item.showCreatorIcon" src="@/assets/creator.png" alt="" class="picon">
                        {{item.title}}
                    </div>
                </div>
                <span class="title">{{item.titleName}}</span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "songList",
    props:{
        songListData:Array,         //数据为一个数组
        column:{
            type:Number,               //控制列数3 or 2
            default:3
        },
        titleTypeName:{
            type:String,
            default:''
        },
        dataType:{
            type:String,
            default:'Mix'
        }
    },
    computed:{
        myStyle(){                   //通过列数计算出每一个格子需要的width
            var obj = {}
            obj.width =  this.column == 2 ? '48%' : '31.32%'
            return obj
        }
    },
    methods:{
        filterCount(num){      //处理播放次数单位
            return num = num > 10000 ? parseInt(num/10000) + "万" : num
        },
        myClick(id){
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
.songListWrap
    width 100%
    overflow hidden
    background white
    // margin-bottom 10px
    .song-type-name
        font-weight 600
        font-size 16px
        margin 16px 16px 6px 16px
    .list-content
        width 100%
        .listItem
            display inline-block
            box-sizing border-box
            margin 6px 1% 6px 1%
            vertical-align top
            // overflow hidden
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
                    box-sizing border-box
                    width 100%
                    padding 0 6px
                    color white
                    position absolute   
                    bottom 6px
                    left 0px
                    font-size 15px
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
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

