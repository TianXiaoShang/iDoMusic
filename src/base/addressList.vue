<template>
    <div class="address-list-wrap">
        <my-scroll 
        :data="addressListData" 
        class="scroll-wrap" 
        ref="myScroll"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="onMyScroll"
        >
            <div class="scroll-content">
                <div 
                class="classify" 
                ref="classIfys"
                v-for="(item,index) in addressListData" 
                :key="index"
                >
                    <div class="typeName">{{item.typeStr}}</div>
                    <div class="classify-content">
                        <div class="item-detail" 
                        v-for="(item,index) in item.detailArr" 
                        :key="index"
                        @click="onClick(item.id)"
                        >
                            <img v-lazy="item.img1v1Url" alt="" class="coverImg">
                            <div class="item-name">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </my-scroll>
         <div class="letters-wrap" 
         @touchstart="onTouchStart"
         @touchmove="onTouchMovet"
         @touchend="onTouchEnd"
         ref="lettersWrap"
         >
            <div 
            class="letterStr" 
            v-for="(item,index) in addressListData" 
            :key="index"
            :data-index="index"
            :class="{active:currentIndex == index}"
            ref="letterItem"
            >
            {{item.typeStr == "其他" ? '~' : item.typeStr}}
            </div>
        </div>
        <loading v-if="!addressListData.length"></loading>
    </div>
</template>

<script>
import myScroll from "base/myScroll"
import {getData} from 'common/js/dom'
import loading from 'base/loading'

const ANCHOR_HEIGHT = 18  //单个字母高度

export default {
    name:"AddressList",
    props:{
        addressListData:Array
    },
    components:{
        myScroll,
        loading
    },
    data(){
        return {
            currentIndex:0,
            currentEle:null,
            posY1:0,
            posY2:0,
            oldIndex:null,          //用来缓存index
            tempIndex:null,         //用来缓存index
            listHeight:[],          //用来存每个字母段高度的数组，用于判断位置区间
            lock:true
        }
    },
    created(){
        this.listenScroll = true    //scroll组件监听scroll事件
        this.probeType = 3          //向scroll组件传递，表示不截流，并监听scroll事件
    },
    watch:{
        tempIndex(newVal){          //通过监听一个临时index改变currentIndex，防止在滑动时累加！
            this.currentIndex = newVal
        },
        addressListData(){          //计算高度数组，用于判断滚动到某个位置同步右侧字母
            setTimeout(() => {this.calculateHiehgt()},20)    
        }
    },
    methods:{
        onClick(id){
            console.log('歌手id='+id)
        },
        onTouchStart(e){             //点击获取deta-index来scrollTo
            this.lock = false        //控制右侧时左侧的监听可以取消
            if(!getData(e.target,'index')){
                return
            }
            this.currentIndex = parseInt(getData(e.target,'index'))
            this.oldIndex = this.currentIndex      //缓存一个index，用来计算相对第一次index增加的距离倍数
            this.currentEle = this.$refs.classIfys[this.currentIndex]
            this.posY1 = e.touches[0].pageY
            this.scrollTo(this.currentEle)
        },
        onTouchMovet(e){             //移动通过与start的y坐标计算得出移动多少个字母单位，进行scrollTo以及边界处理
            this.lock = false        //控制右侧时左侧的监听可以取消
            this.posY2 = e.touches[0].pageY
            var offsetIndex = (this.posY2 - this.posY1) / ANCHOR_HEIGHT | 0    //距离点击位置的Y轴偏移量计算出index偏移数
            var num = offsetIndex + this.oldIndex;
            num = num < 0 ? num = 0 : num                                                         //处理边界情况
            num = num > this.$refs.letterItem.length ?  this.$refs.letterItem.length - 1 : num    //处理边界情况
            this.tempIndex = num  //通过点击时候的缓存的index，用来在滑动过程中计算，直接使用currentIndex会一直累加
            this.currentEle = this.$refs.classIfys[this.currentIndex]
            this.scrollTo(this.currentEle)
        },
        onTouchEnd(){
            this.lock = true          //离开解锁，用于左侧滚动控制
        },
        onMyScroll(pos){              //滚动左侧，利用当前位置与初始化的高度数组进行比较，拿出数组中所有不大于pos.y的位置中的最大值，即为当前的index
            if(this.lock){
                var arr = []
                this.listHeight.forEach((item,index) => {
                    if(-pos.y >= item){                    //等于别忘了写，妈蛋！！！
                        arr.push(index)
                    }
                })
                var num = Math.max.apply(null, arr)
                this.currentIndex = num < 0 ? 0 : num
            }
        },
        calculateHiehgt(){
            this.listHeight = []
            var eleList = this.$refs.classIfys
            var height = 0
            this.listHeight.push(height)    //首先push顶端Y坐标，之后都是单位高度作为底部Y坐标
            eleList.forEach((item,index) => {
                height += item.clientHeight
                this.listHeight.push(height)
            })
        },
        scrollTo(ele){
            this.$refs.myScroll.scrollToElement(ele,300)
        },
        refresh() {                         //定义这个方法，供singer组件调用，从而调用scroll组件的refresh方法
            this.$refs.myScroll.refresh()
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
    .address-list-wrap
        position fixed
        top 134px
        bottom 0
        width 100%
        .scroll-wrap
            width 100%
            height 100%
            overflow hidden
            background-image url('../assets/BgImage1.png')
            background-size cover
            .scroll-content
                width 100%
                background white
                .classify
                    width 100%
                    .typeName
                        box-sizing border-box
                        height 30px
                        padding 4px 10px
                        font-size 16px
                        background rgb(242,242,242)
                        color $themeColor
                    .classify-content
                        padding 0 20px
                        width 100%
                        .item-detail
                            display flex
                            width 100%
                            overflow hidden
                            align-items center
                            padding 8px 0px
                            .coverImg
                                width 50px
                                height 50px
                                border-radius 50%
                                overflow hidden
                            .item-name
                                margin-left 15px
                                font-size 14px
        .letters-wrap
            padding 15px 0
            background #ddd
            opacity 0.9
            position absolute 
            top 15%
            right 8px
            border-radius 15px
            .letterStr
                box-sizing border-box
                height 18px
                font-size 12px 
                padding 1px 3px 1px 4.5px
                &.active
                    color $themeColor 
                            





</style>
