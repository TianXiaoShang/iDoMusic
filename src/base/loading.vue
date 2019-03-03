<template>
    <div class="loadingWrap" ref="loadingWrap">
        <div class="imgWrap">
            <img class="loadingImg" src="@/assets/loading.png" alt="">
        </div>
        
    </div>
</template>


<script>
export default {
    name:"Loading",
    props:{
        opacity:{
            type:Number,
            default:0.08
        }
    },
    mounted(){
        this.$refs.loadingWrap.style.background = `rgba(20,20,20,${this.opacity})`
    }
}
</script>

<style lang="stylus" scoped>
    .loadingWrap
        position absolute 
        left 0
        right 0
        bottom 0
        top 0
        z-index 990
        .imgWrap
            position absolute 
            width 50px
            left 50%
            top 50%
            transform translate(-50%,-50%)
            .loadingImg 
                width 100%
                height 100%
                animation rotating 0.9s linear infinite
                @keyframes rotating
                    0% 
                        transform rotate(0deg)
                    100% 
                        transform rotate(360deg)
</style>
