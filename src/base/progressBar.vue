<template>
    <div class="progress-wrap">
        <div class="current-time">{{fliterTimeStr(myCurrentTime)}}</div>
        <div class="control-wrap"  ref="allBar">
            <div class="all-bar"></div>
            <div class="played-bar" ref="palyed">
                <div class="porint"
                @touchstart.stop.prevent="onTouchStart"
                @touchmove.stop.prevent="onTouchMove"
                @touchend.stop.prevent="onTouchEnd"
                ></div>
            </div>
        </div>
        <div class="duration-time">{{fliterTimeStr(audioDur)}}</div>
    </div>

</template>

<script>
export default {
    name:'ProgressBar',
    props:{                //该组件需传入当前时长跟总时长
        currentTime:{      //当前时长
            type:Number,
            defult: 0
        },
        audioDur:{         //总时长
            type:Number,
            defult: 0
        }
    },
    mounted(){

    },
    watch:{
        percentage(newVal){
            if(!this.moveStatus){                                     //拖动时进度条不受父级currentTime影响
                this.playedBarWidth = this.allBarWidth * newVal       //通过百分比计算出当前宽度偏移
            }
        },
        currentTime(newVal){
            if(!this.allBarWidth){
                this.allBarWidth = this.$refs.allBar.clientWidth      //总长度
                this.allOffsetLeft = this.$refs.allBar.offsetLeft     //left偏移量
            }
            if(!this.moveStatus){                                     //按住的时候不监听父级的currentTime
                this.myCurrentTime = newVal                           //避免直接修改props的值，会报错
                this.percentage = newVal / this.audioDur
            }
            if(newVal === 0){                                          //切歌时候手动归零
                this.percentage = 0;
                this.$refs.palyed.style.width = '0px'
            }
        },
        playedBarWidth(newVal){                                        //拖动使得进度改变时候自动改变百分比跟当前时间
            this.$refs.palyed.style.width = `${this.playedBarWidth}px`
            this.percentage = newVal / this.allBarWidth
            this.myCurrentTime = this.audioDur * this.percentage
        }
    },
    data(){
        return {
            allBarWidth: 0,       //bar总宽
            playedBarWidth:0,     //进度条宽度
            allOffsetLeft:0,      //左偏移，用来计算拖动的长度
            percentage:0,          //百分比
            moveStatus:false,
            firstX:0,
            lastX: 0,
            currentWidth:0,
            myCurrentTime:0
        }
    },
    methods:{
        fliterTimeStr(num){                //处理时长字符串
            var str = num / 60
            var minute = str | 0
            var second = (str - minute) * 60 | 0
            minute = minute < 10 ? '0' + minute : minute
            second = second < 10 ? '0' + second : second
            return minute + ":" + second
        },
        onTouchStart(e){            
            this.moveStatus = true    //用于判定拖动状态
            this.firstX = e.touches[0].pageX
            this.currentWidth = this.$refs.palyed.offsetWidth
        },
        onTouchMove(e){
            this.lastX = e.touches[0].pageX
            if(this.lastX < this.allOffsetLeft){
                this.playedBarWidth = 0
            }else if(this.lastX > this.allOffsetLeft + this.allBarWidth){
                this.playedBarWidth = this.allBarWidth
            }else{
                this.playedBarWidth = this.lastX - this.firstX + this.currentWidth
            }
        },
        onTouchEnd(e){
            this.moveStatus = false    
            if(this.lastX > this.allOffsetLeft + this.allBarWidth){
                this.playedBarWidth = this.allBarWidth
            }else{
                this.playedBarWidth = this.lastX - this.firstX + this.currentWidth
            }
            this.$emit('changePerc',this.percentage)                           //将当前进度百分比派发给父组件使用
        }
    }
}
</script>


<style lang="stylus" scoped>
@import '~common/styles/variable'

    .progress-wrap
        width 100%
        height 100%
        display flex
        justify-content cspace-between
        align-items center
        .control-wrap
            position relative
            background black
            flex 1
            width 100%
            .all-bar
                position relative
                width 100%
                height 3px
                background white
                border-radius 4px
            .played-bar
                position absolute
                width 0
                height 3px
                top 0
                left 0
                background pink
                .porint
                    position absolute
                    left 100%
                    margin-left -5px
                    top -3px
                    border-radius 50%
                    width 10px
                    height 10px
                    background $themeColor
                    &:before
                        content: ''
                        position: absolute
                        top: -10px
                        left: -10px
                        right: -10px
                        bottom: -10px
        .current-time
        .duration-time
            padding 0 10px
            font-size 14px


</style>
