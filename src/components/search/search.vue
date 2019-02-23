<template>
    <div class="search-Wrap">
        <div class="input-wrap">
            <img class="logo" src="@/assets/logo.png"/>
            <div class="input">
                <input 
                class="searchInput"  
                placeholder="搜索歌曲 / 歌手 / 歌单"
                v-model='value'
                @input="myInput"
                @focus="myFocus" type="text">
                <img class="searchIcon"
                @click="_getSearchData" 
                src="@/assets/search.png"/>
            </div>
        </div>
        <div class="view-content" ref='viewContent'>
            <img class="close" 
            src="@/assets/down.png" 
            @click="myClose"> 
            <div class="hotRec-wrap">
                <div class="hot-title">热搜榜</div>
                <div class="hot-content">
                    <span 
                    @click="selectRecKeyword"
                    class="hot-item" 
                    v-for="(item,index) in hotSearchData"
                    :key="index"
                    >{{item.first}}</span>
                </div>
            </div>
            <div class="search-history">
                <div class="history-title">
                    <div class="title-name">搜索历史</div>
                    <img src="@/assets/clear.png" alt="" 
                    class="clear-icon" 
                    @click="myClearHistory">
                </div>
                <div class="history-content">
                    <div class="history-item" @click='selectRecKeyword'>
                        <div class="item-name">陷阱</div>
                        <img class="delete-icon" 
                        src='@/assets/delete.png' 
                        @click.stop.prevent="myDeleteHistory">
                    </div>
                </div>
            </div>
            <div class="search-list-wrap" ref="listWrap">
                <div class="type-wrap">
                    <div 
                    class="type-name" 
                    v-for="(item,index) in titleTypes"
                    :key="index"
                    :class="{active:currentType == index}"
                    @click="changeType(index)"
                    >
                    {{item}}
                    </div>
                </div>
                <router-view name="search"></router-view>
            </div>
        </div>

        <div class="recSearch-wrap" v-show='value.length && recSearchData && recSearchData.length'>
            <div class="rec-item" 
            @click="selectRecKeyword"
            v-for="(item,index) in recSearchData" 
            :key="index">
            {{item.keyword}}
            </div>
        </div>

    </div>
</template>

<script>
import {getHotRecSearchData,getRecSearchData,getSearchData} from 'api/search'
import {STATUS_TEXT} from 'api/config'

export default {
    name: "Search",
    data(){
        return {
            hotSearchData:[],
            recSearchData:[],
            searchListData:[],
            value:'',
            myTimer:null,
            titleTypes:['歌 曲','歌 手','歌 单'],
            currentType:0
        }
    },
    methods:{
        myFocus(e){                      //input聚焦
            this.$refs.viewContent.style.top = '55px'
        },
        myInput(e){                      //防抖监听input 
            clearTimeout(this.myTimer)
            this.myTimer = setTimeout(() => {
                this._getRecSearchData()
            },500)
        },
        selectRecKeyword(e){             //点击搜索推荐
            this.value = ''
            var keyWords = e.target.innerText
            this._getSearchData(keyWords)    
            this.$refs.listWrap.style.top = 30 + 'px'
        },
        changeType(e){                    //切换搜索type类型
            this.currentType = e
            this.$router.push({
                name:'search',
            })
        },
        _getSearchData(keyWords){                //搜索数据
            keyWords = typeof keyWords == 'string' ? keyWords : this.value   //判断点击是点击搜索还是点击名字
            keyWords && getSearchData(keyWords).then(res=> {
                console.log(res)
                if(res.statusText === STATUS_TEXT){
                    this.searchListData = res.data.result.songs
                }
            })
        },
        _getRecSearchData(){             //获取搜索推荐数据
                //有值的时候才发送请求
                this.value &&  getRecSearchData(this.value).then(res=> {
                    console.log(res)
                    if(res.statusText === STATUS_TEXT){
                        this.recSearchData = res.data.result.allMatch
                    }
                })
        
        },
        
        myClose(){                       //关闭弹窗，downOut
            this.$refs.viewContent.style.top = this.ClientHeight +'px'
            this.$refs.listWrap.style.top = '100%'
        },
        myDeleteHistory(){               //删除某条搜索历史
            console.log('DeleteHistory')
        },
        myClearHistory(index){           //清除全部搜索历史
            console.log('ClearHistory')
        },
        _getRecSearch(){                 //获取热搜数据
             getHotRecSearchData().then(res => {{
                if(res.statusText == STATUS_TEXT){
                    this.hotSearchData = res.data.result.hots
                }
             }})
        },
        _initHeight(){                  //初始化弹窗height及top
            this.ClientHeight = document.documentElement.clientHeight
            this.$refs.viewContent.style.top = this.ClientHeight + 'px'
            this.$refs.viewContent.style.height = this.ClientHeight - 55 + 'px'
        }
    },
    created(){
        this._getRecSearch() 
    },
    mounted(){
        this._initHeight()
        window.addEventListener('resize', () => {      //监听resize事件，屏幕尺寸变化时候触发，从而重新初始化
             this._initHeight()
        })
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"    
//注意，这里的~common，首先~为stylus的语法，其次必须在common在已通过vue.config.js中resolve自定义设定路径后才能使用该语法
    .search-Wrap
        width 100%
        position relative   
        .input-wrap
            display flex
            width 100%
            height 44px
            padding-top 6px
            align-items center
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

        .view-content
            position absolute
            width 100%
            z-index 999
            background rgba(250,250,250,1)
            border-radius 15px 15px 0 0
            transition top 0.4s
            .close
                position absolute 
                right 15px
                top 5px
                width 23px
            .hotRec-wrap
                width 100%
                margin-top 30px
                .hot-title
                    height 30px
                    line-height 30px
                    font-weight 600
                    margin  0 20px
                    color $themeColor
                    font-size 18px
                    border-bottom 1px solid $themeColor
                .hot-content
                    box-sizing border-box
                    width 100%
                    padding 6px 20px
                    &:after
                        content ''
                        display block
                        clear both
                    .hot-item
                        font-size 15px
                        float left
                        padding 4px 10px
                        margin 5px
                        border-radius 15px
                        background #eee
            .search-history
                width 100%
                margin-top 20px
                .history-title
                    display flex
                    justify-content space-between
                    align-items center
                    height 30px
                    margin 5px 20px
                    border-bottom 1px solid $themeColor
                    .title-name
                        font-weight 600
                        color $themeColor
                        font-size 18px
                    .clear-icon
                        width 25px
                .history-content
                    width 100%
                    height 100px
                    .history-item
                        display flex
                        align-items center
                        justify-content space-between
                        margin 8px 20px
                        .item-name
                            font-size 16px
                        .delete-icon
                            width 20px
            .search-list-wrap
                position absolute
                top 100%
                left 0
                bottom 0
                width 100%
                background white
                transition top 0.4s
                .type-wrap
                    width 100%
                    padding 3px 5px 5px 5px
                    display flex
                    justify-content space-around
                    align-items center
                    background rgb(240,240,240)
                    .type-name 
                        font-size 15px
                        padding 5px
                        &.active
                            color $themeColor
                            border-bottom 1.5px solid $themeColor





        .recSearch-wrap
            position absolute 
            box-sizing border-box
            background white
            z-index 999
            margin 0 auto
            left 0
            right 0
            top 50px
            border-radius 5px
            box-shadow 0 4px 6px 2px #ccc
            width 95%
            padding 10px 15px
            .rec-item
                display flex
                align-items center
                padding 8px
                font-size 16px
                border-bottom 1px solid #eee
            .rec-item:before
                content ''
                display block
                margin-right 10px
                width 18px
                height 18px
                background url('../../assets/search.png')
                background-size cover
                

                
</style>
