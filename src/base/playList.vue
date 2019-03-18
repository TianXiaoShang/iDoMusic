<template>
    <div class="palyList-wrap">
        <div class="search-history">
            <div class="history-title" v-if='title'>
                <div class="title-name">{{title}}（{{playListData.length}}）</div>
                <img src="@/assets/clear.png" alt="" 
                class="clear-icon" 
                @click.stop="myClear">
            </div>
            <!-- <my-scroll :click="click" :data="playListData" class='myScroll' ref="myScroll"> -->
                <div class="history-content">
                    <div 
                    :class="{active : index === currentIndex}"
                    ref="listItem"
                    class="history-item"
                    @click.stop='mySelect'  
                    v-for="(item, index) in playListData" 
                    :key="index"
                    >
                        <div class="item-name" :key="item">{{item}}</div>
                        <img class="delete-icon" 
                        src='@/assets/delete.png' 
                        @click.stop="myDelete(index)">
                    </div>
                </div>
                <div class="noMore" v-show="!playListData.length">{{hint}}</div>
            <!-- </my-scroll> -->
        </div>
    </div>
</template>

<script>
import myScroll from 'base/myScroll'

export default {
    name:"PlayList",
    props:{
        playListData:Array,
        title:String,
        hint:String,
        currentIndex:Number
    },
    data(){
        return {
            // currentIndex: '',
            // click:false       //防止scroll嵌套时多次点击，在搜索历史
        }
    },
    // components:{
    //     myScroll
    // },
    methods:{
        myClear(){
            this.$emit('myClear')
        },
        myDelete(index){
            this.$emit('myDelete',index)
        },
        mySelect(e){
            this.$emit('mySelect',e)
        },
        // scrollToElement(index){
        //     this.currentIndex = index
        //     setTimeout(() => {
        //         if(this.$refs.listItem){
        //             var currentMusic = this.$refs.listItem[index]
        //             this.$refs.myScroll.scrollToElement(currentMusic,250,0,-143)
        //         }
        //     },20)
            
        // }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
.palyList-wrap
    width 100%
    .search-history
        position relative
        width 100%
        .history-title
            display flex
            justify-content space-between
            align-items center
            height 30px
            margin 5px 20px
            border-bottom 1px solid $themeColor
            box-sizing border-box
            .title-name
                font-weight 600
                color $themeColor
                font-size 18px
            .clear-icon
                width 25px
        // .myScroll
        //     // position absolute 
        //     // top 30px
        //     // bottom 0
        //     // left 0
        //     // right 0
        //     width 100%
        //     overflow hidden
        //     height 100%
        .history-content
            width 100%
            .history-item
                display flex
                align-items center
                justify-content space-between
                margin 0px 20px
                border-bottom 1px solid #eee
                box-sizing border-box
                &.active 
                    color $themeColor
                .item-name
                    width 90%
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                    font-size 16px
                    line-height 26px
                    padding 4px 0
                .delete-icon
                    width 18px
        .noMore
            text-align center
            padding 10px 0
            color #aaa
            font-size 15px
</style>
