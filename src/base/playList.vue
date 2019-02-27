<template>
    <div class="palyList-wrap">
        <div class="search-history">
            <div class="history-title" v-if='title'>
                <div class="title-name">{{title}}</div>
                <img src="@/assets/clear.png" alt="" 
                class="clear-icon" 
                @click="myClear">
            </div>
            <div class="history-content" 
            v-for="(item, index) in playListData" 
            :key="index">
                <div class="history-item" @click.stop.prevent='mySelect'>
                    <div class="item-name">{{item}}</div>
                    <img class="delete-icon" 
                    src='@/assets/delete.png' 
                    @click.stop.prevent="myDelete(index)">
                </div>
            </div>
            <div class="noMore" v-if="!playListData.length">{{hint}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name:"PlayList",
    props:{
        playListData:Array,
        title:String,
        hint:String
    },  
    methods:{
        myClear(){
            this.$emit('myClear')
        },
        myDelete(index){
            this.$emit('myDelete',index)
        },
        mySelect(e){
            this.$emit('mySelect',e)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"

    .search-history
        width 100%
        .history-title
            display flex
            justify-content space-between
            align-items center
            height 30px
            margin 5px 20px
            border-bottom 1px solid $themeColor
            .title-name
                font-weight 600
                color $themeColor
                font-size 18px
            .clear-icon
                width 25px
        .history-content
            width 100%
            .history-item
                display flex
                align-items center
                justify-content space-between
                margin 4px 20px
                border-bottom 1px solid #eee
                .item-name
                    font-size 16px
                    padding 4px 0
                .delete-icon
                    width 20px
        .noMore
            text-align center
            padding 10px 0
            color #bbb
            font-size 15px
</style>
