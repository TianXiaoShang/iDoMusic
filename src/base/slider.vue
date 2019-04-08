<template>
    <div class="wrap" >
        <div class="sliderWrap" ref="sliderWrap">
            <div class="slider-group" ref="sliderGroup">
                <slot></slot>
            </div>
            <div class="dots">
                <span class="dot" 
                :class="{active: currentPageIndex === index}" 
                v-for="(item,index) in dots" 
                :key="index"></span>
            </div>
        </div>
    </div>

</template>
<script>
import Bscroll from "better-scroll"
import addClass from "common/js/dom"

export default {
  name: "Slider",
  data(){
      return{
          currentPageIndex:0,   //当前索引
          dots:[]               //用于维护小圆点
        }
  },
  props: {
        bannerData:Array,
        params: {
        type: Object,
        default: {
            loop: {
            type: Boolean, //默认循环播放
            default: true
            },
            autoPlay: {
            type: Boolean, //默认自动轮播
            default: true
            },
            interval: {
            type: Number, //默认轮播切换时间
            default: 3000
            }
        }
        }
  },
  watch:{
        bannerData(){
            this._sliderInit();  //有数据的时候才初始化，因为以下初始化极度依赖dom。没有数据就没有dom
        }
  },
  mounted() {
        // this._sliderInit();   //因为mounted必然是先于数据的！所以这里注释掉，直接用watch
  },
  methods: {
      _sliderInit(){
        setTimeout(() => {       //异步给数据先填充dom，20秒只是一个相对科学的时间值，没有dom就没法计算宽度初始化等
            this._setSliderWidth();
            this._setDos();
            this._initBscroll();
            this._play();
            window.addEventListener('resize', () => {   //监听resize事件，屏幕尺寸变化时候触发，从而从新设置宽度
                if (!this.slider) {                     //在实例化前不需要
                    return
                }
                this._setSliderWidth()
                this.slider.refresh()                  //内置方法，根据setSliderWidth的结果重新计算滚动距离
            })
        },20)
      },
    _setSliderWidth() {
        this.childrens = this.$refs.sliderGroup.children;    //轮播图数组,挂个this方便初始化dots使用
        var wrapWidth = this.$refs.sliderWrap.clientWidth;  //盒子宽度
        var groupsWidth = this.childrens.length * wrapWidth;     //滚动区总长
        for(var i = 0; i < this.childrens.length; i++){
            var child = this.childrens[i];
            addClass(child,"slider-item");          //给每个图片设置class以添加样式
            child.style.width = wrapWidth + 'px';   //设置每张图的宽度；
        }
        if(this.params.loop){                       //如果循环混动需要增加两张图片的长度
            groupsWidth += 2*wrapWidth;
        }
        this.$refs.sliderGroup.style.width = groupsWidth + 'px';  //设置滚动区总长度
    },
    _setDos(){
        this.dots = new Array(this.childrens.length);
    },
    _initBscroll(){
        this.slider = new Bscroll(this.$refs.sliderWrap, {
            scrollY:false,        //y轴不需要滚动
            scrollX:true,         //x轴需要滚动
            momentum: false,       //是否开启滑动惯性快速滚动多张轮播
            click:true,
            // snap:true,//给slider组件设置
            snap:{
                loop:this.params.loop,//是否可以无缝循环轮播
                threshold:0.3,//用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
                speed:600 //轮播图切换的动画时间
            },
            // snap:true,
            // snapLoop:this.loop,//是否可以无缝循环轮播
            // snapThreshold:0.3,//用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
            // snapSpeed:400,//轮播图切换的动画时间
        });

        this.slider.on('scrollEnd', () => {                      //better-scroll派发的事件,滚动结束派发；
            this.currentPageIndex = this.slider.getCurrentPage().pageX;  //获取当前页面的索引
            if (this.params.autoPlay) {
                clearTimeout(this.timer)     
                //注意这里的bug，在循环播放时，最前面会有重复的一张图，会连续滚动两张图而触发两个end事件，若不清除定时器，则会开启两个定时器导致从第一张图直接跳到第三张
                this._play()                                     
            }
         });

         this.slider.on('beforeScrollStart', () => {//手动滚动开始之前（非手动不触发），先清除定时器
          if (this.params.autoPlay) {
            clearTimeout(this.timer)
          }
        })
    },
    _play(){
        this.timer = setTimeout(() => {
               this.slider.next()
           },this.params.interval)
    }
  }
};
</script>

<style lang='stylus' scoped>
@import "~common/styles/variable"
.wrap
    width 100%
    position relative
    &:before
        position absolute
        width 100%
        content ''
        display block
        height 100px
        background $themeColor
        border-radius 0 0 10px 10px
    .sliderWrap
        // padding-top 8px
        position relative
        width 95%
        margin 0 auto
        border-radius 10px
        overflow: hidden
        .slider-group
            overflow hidden
            border-radius 10px
            white-space nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                width 398px
                border-radius 10px
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                    border-radius 10px
                    img
                        display: block 
                        width: 100%
                        border-radius 10px
                        -webkit-appearance none 
        .dots
            position absolute 
            left 50%
            transform translate(-50%)
            bottom 8px
            margin 0 auto
            padding 0 10px
            height 16px
            border-radius 10px
            text-align center     
            .dot
                display inline-block
                width 8px
                height 8px
                margin 0 3px
                border-radius 50%
                background white
                opacity 0.9
                &.active
                    width 20px
                    border-radius 5px
                    background $themeColor
</style>
