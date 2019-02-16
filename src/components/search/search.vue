<template>
    <div class="wrap">
        <img class="logo" src="@/assets/logo.png"/>
        <div class="input">
            <input class="searchInput" type="text">
            <img class="searchIcon" src="@/assets/search.png"/>
        </div>
    </div>
</template>

<script>
export default {
    name: "Search"
    
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"    
//注意，这里的~common，首先~为stylus的语法，其次必须在common在已通过vue.config.js中resolve自定义设定路径后才能使用该语法
    .wrap
        display flex
        width 100%
        height 44px
        padding-top 6px
        align-items center
        // border-bottom 1.5px solid $themeColor
        .logo
            margin 0 14px
            width 60px
        .input
            border 1.5px solid $themeColor
            margin-right 10px
            border-radius 16px
            flex-grow 1
            height 65%
            overflow hidden
            display flex
            align-items center
            .searchInput
                outline:none
                flex-grow 1
                margin-left 12px
                width 90%
                height 100%
                border none
            .searchIcon
                height 83%
                margin 0 10px
</style>
