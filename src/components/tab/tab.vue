<template>
    <div class="tabWrap">
        <ul class="title">
            <router-link tag="li" to="/recommend">
                <span class="tab-items">个性推荐</span>
            </router-link>
            <router-link tag="li" to="/songs">
                <span class="tab-items">歌 单</span>
            </router-link>
            <router-link tag="li" to="/rank">
                <span class="tab-items">排行榜</span>
            </router-link>
            <router-link tag="li" to="/singer">
                <span class="tab-items">歌 手</span>
            </router-link>
        </ul>
    </div>

</template>

<script>
export default {
    name:"Tab"
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"
    .title
        box-sizing border-box
        width 100%
        height 44px
        background $themeColor
        display flex
        align-items center
        list-style none
        justify-content space-around
        padding 4px 8px
        .tab-items
            color white
            display inline-block
            text-align center
            font-size 16px
            height 26px
            line-height 25px
            padding 0 14px
    &.router-link-active
        .tab-items 
            border-radius 16px
            background white
            color $themeColor

            
</style>
