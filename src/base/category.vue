<template>
    <div class="category-wrap">
        <div class="category">
            <span 
            class="item"
            :class="{active : item.fatherNum == currentFather}" 
            v-for="(item, index) in categoryData.fathers" 
            :key="index" 
            data-myyIndex="111"
            @click="changeFather(item.fatherNum)"
            >{{item.fatherName}}</span>
        </div>
        <div class="childerns" v-show="typeShow">
            <div class="types-wrap">
                <span class="types"
                v-for="(item, index) in categoryData.children" :key="index"
                v-show="item.category == currentFather"
                @click="changeChild(item.name,item.category,item.resourceType)"
                :class="{active : item.name == currentName}"
                >{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Category',
    props:{
        categoryData:Object   //传入数据结构为{fathers:[{fatherNum:xx,fatherName}...],children:[{name:xxx,category:xxx}...]}
    },
    data(){
        return{
            currentFather:-1,
            currentName:null,
            typeShow:true,
        }
    },
    mounted(){
        this.changeType()
    },
   
    methods:{
        changeFather(fatherIndex){
            this.typeShow = fatherIndex == this.currentFather ? !this.typeShow : true
            this.currentFather = fatherIndex                          //控制father样式及children隐藏/显示
            if( fatherIndex == -1){
                this.changeType()
            }
        },
        changeChild(childName,category, resourceType){
            this.currentName = childName
            setTimeout(() => {                                       //为了给用户看到点击后的反应而延迟隐藏
                this.typeShow = false
            },100)
            this.changeType(category,childName,resourceType)
        },
        changeType(category,typeName,resourceType){
            this.$emit("changeType",{
                category,     //从属父级类型
                typeName,     //当前标签名字
                resourceType, //当前标签标识ID
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
        border-bottom 1px solid $themeColor
        .item
            flex-grow 1
            text-align center
            padding 0px 8px
            color $fontGray
            height 100%
            line-height 40px
            &.active
                border-radius 6px 6px 0 0 
                color $themeColor
    .childerns
        position absolute
        z-index 999
        width 100%
        background white
        opacity 0.92
        .types-wrap
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
                width 33.33%
                padding 8px
                color $fontGray
                background $BgGray
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

</style>


