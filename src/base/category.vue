<template>
    <div class="category-wrap">
        <div class="category">
            <span 
            class="item"
            :class="{active : item.typeNum == clickIndex}" 
            v-for="(item, index) in categoryData.categorys" 
            :key="index" 
            data-myyIndex="111"
            @click="selectClass(item.typeNum,$event)"
            >{{item.typeName}}</span>
        </div>
        <div class="childerns" v-show="typeShow">
            <div class="types-wrap">
                <span class="types"
                v-for="(item, index) in categoryData.types" :key="index"
                v-show="item.category == clickIndex"
                @click="selectType(item.name,item.category)"
                :class="{active : item.name == currentName}"
                >{{item.name}}</span>
            </div>
        </div>
        <!-- <div class="hintTitle">
            {{hintTitle}}
        </div> -->
    </div>
</template>

<script>
export default {
    name:'Category',
    props:{
        categoryData:Object
    },
    data(){
        return{
            clickIndex:-1,
            currentName:null,
            typeShow:true,
            // hintTitle:"全部歌单"
        }
    },
    mounted(){
        this.changeType()
    },
   
    methods:{
        selectClass(e,$event){
            this.typeShow = e == this.clickIndex ? !this.typeShow : true
            this.clickIndex = e
            // this.hintTitle = e == -1 ? "全部歌单" : this.hintTitle
            if( e == -1){
                this.changeType()
            }
        },
        selectType(type,category){
            this.currentName = type
            setTimeout(() => {        //为了给用户看到点击后的反应而延迟隐藏
                this.typeShow = false
            },100)
            this.changeType(category,type)
        },
        changeType(category,type){
            // this.hintTitle = this.categoryData.categorys[category+1].typeName + ' / ' + type 
            // console.log(this.hintTitle)
            this.$emit("changeType",{
                category,
                type
            })
        }
    }


}
</script>

<style scoped lang="stylus">
@import "~common/styles/variable"
    .category
        box-sizing border-box
        height 40px
        width 100%
        padding 0px 10px
        background white
        display flex
        // align-items center
        // justify-content space-around
        border-bottom 1px solid $themeColor
        .item
            flex-grow 1
            text-align center
            padding 0px 8px
            color $fontGray
            height 100%
            line-height 40px
            &.active
                // border-bottom 1px solid $themeColor
                // background $gray
                border-radius 6px 6px 0 0 
                color $themeColor
    .childerns
        position absolute
        z-index 999
        width 100%
        background white
        opacity 0.92
        .types-wrap
            // border-top 1px solid $themeColor
            box-sizing border-box
            display flex
            justify-content flex-sart
            width 100%
            flex-wrap wrap
            .types
                box-sizing border-box
                border 1px solid #ddd
                text-align center
                font-size 14px
                display block
                width 20%
                padding 8px
                color $fontGray
                background $BgGray
                // margin:0px 0px -1px -1px
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
                &.active
                    position relative
                    color $themeColor
                    border-color $themeColor
                &.active:before
                    position absolute
                    bottom 8px
                    right 8px
                    content ""
                    display block
                    width 6px
                    height 6px
                    border-radius 50%
                    background $themeColor
    // .hintTitle
    //     display inline-block
    //     // box-sizing border-box
    //     // width 100%
    //     font-size 12px
    //     line-height 12px
    //     height 12px
    //     color $fontGray
    //     text-align center
    //     padding 4px 15px
    //     border-radius 18px
    //     border 1px solid $themeColor

</style>


