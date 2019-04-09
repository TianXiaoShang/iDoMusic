<template>
    <div class="category-wrap" ref="cateGoryWrap">
        <div class="category">
            <span 
            class="item"
            :class="{active : item.fatherNum == fatherShow}" 
            v-for="(item, index) in categoryData.fathers" 
            :key="index" 
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
            fatherShow:-1,
            oldFaterShow:-1
        }
    },
    mounted(){
        this.changeType()
    },
    activated(){
        document.getElementById('app').addEventListener('touchstart',this.isClickOut,false)    //用于判断点击区域绑定全局touchstart事件，更改chlidrens状态
    },
    deactivated(){
        document.getElementById('app').removeEventListener('touchstart',this.isClickOut,false)    //用于判断点击区域绑定全局touchstart事件，更改chlidrens状态
    },
    // beforeDestroy() {
    //     console.log('111')
    //     document.removeEventListener("click", this.isClickOut);
    // },
    methods:{
        changeFather(fatherIndex){
            this.typeShow = true
            this.currentFather = fatherIndex      //控制children隐藏/显示
            this.fatherShow = fatherIndex
            if( fatherIndex == -1){               //点击第一个重新请求并不传参数默认对应第一个数据，并且消除子项的样式
                this.changeType()   
                this.oldFaterShow = -1            //维护一个oldFaterShow,用于在隐藏子级的时候切回正当前所在父级类型
                this.fatherShow = -1              //父级的样式，          
                this.currentName = null
            }
        },
        changeChild(childName,category, resourceType){
            this.oldFaterShow = category          //缓存父级当前样式，如果没有切换children则用于切回上次样式
            this.fatherShow = category            //父级的样式由当前子级的所属类型来控制
            this.currentName = childName
            setTimeout(() => {                    //为了给用户看到点击后的反应而延迟隐藏
                this.typeShow = false
            },100)
            this.changeType(category,childName,resourceType)
        },
        changeType(category,typeName,resourceType){
            this.$emit("changeType",{
                category,      //从属父级类型
                typeName,      //当前标签名字
                resourceType,  //当前标签标识ID
            })
        },
        isClickOut(e){
            // alert(this.$refs.cateGoryWrap.className)
            // this.$refs.cateGoryWrap.style.display = 'none'
            try{
                e.path.forEach(item => {
                    if(item == this.$refs.cateGoryWrap){
                        throw new Error('StopIteration')      //如果点击的是二级菜单区域则跳出循环并在catch中return
                    }
                })  
            }catch(e){
                if (e.message !== 'StopIteration')  throw e
                return          
            }
            this.fatherShow = this.oldFaterShow     //在切出时，切回父级之前样式
            this.typeShow = false    //如果包含this.$refs.cateGoryWrap则在上方return,否则赋值false隐藏


            // var flag = true
            // e.path.forEach(item => {
            //     if(item == this.$refs.cateGoryWrap){
            //         flag = false
            //     }
            // })  
            // if(flag){
            //     this.fatherShow = this.oldFaterShow     //在切出时，切回父级之前样式
            //     this.typeShow = false    //如果包含this.$refs.cateGoryWrap则在上方return,否则赋值false隐藏
            //     alert('隐藏')
            // }
            // alert(this.typeShow)
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
        position relative
        z-index 501
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
                width 33.32%
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