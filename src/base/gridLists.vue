<template>
    <div class="grid-list-wrap">
        <!-- <div class="grid-type-name">{{typeName}}</div>
        <div class="content-wrap">
            <div class="grid-item" v-for="(item,index) in data" :key="index">
                <div class="item-cover">
                    <img :src="item.coverImgUrl" alt="" class="cover-img">
                    <div class="update-time">{{item.updateFrequency}}</div>
                </div>
            </div>
        </div> -->
    </div>
</template>

// <script>
// export default {
//     name: "GridList",
//     props:{
//         data:Array,
//         typeName:String
//     },
    
// }
// </script>

<style lang="stylus" scoped>
    .grid-list-wrap
        box-sizing border-box
        margin-top -1px
        padding 12px 10px 0 10px
        padding-top 12px
        width 100%
        background white
        .grid-type-name
            font-size 18px
            .content-wrap
                width 100%
                


</style>
