<template>
    <div class="popup-wrap">
        <div class="view-content" @touchstart="myStart" v-show="viewShow">
            <img class="close" 
            src="@/assets/down.png" 
            @click="myClose"> 
            <my-scroll class="navigationScroll" ref="myScroll">
                <slot></slot>
            </my-scroll>
    </div>
    </div>
</template>

<script>
import myScroll from 'base/myScroll'
export default {
    name:'Popup',
    props:{
        viewShow:Boolean
    },
    components:{
        myScroll
    },
    methods:{
        myClose(){
            this.$emit('myClose')
        },
        myStart(){
            this.$emit('myStart')
        }
    }
}
</script>

<style lang='stylus' scoped>
     .view-content
            position absolute
            width 100%
            z-index 990
            background rgba(250,250,250,1)
            border-radius 15px 15px 0 0
            transition top 0.4s
            .close
                position absolute 
                right 15px
                top 5px
                width 23px

</style>
