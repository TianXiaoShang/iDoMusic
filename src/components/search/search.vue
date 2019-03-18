//首先自我检讨，应该把弹窗做成组件，给自己一耳光！主要因为样式结构是现想现做，没有提前构架思考！！

<template>
    <div class="search-Wrap">
        <div class="input-wrap">
            <img class="logo" src="@/assets/logo.png"/>
            <div class="input">
                <input 
                ref="searchInput"
                class="searchInput"  
                placeholder="搜索歌曲 / 歌手 / 歌单"
                v-model='value'
                @input="myInput"
                @focus="myFocus" type="text">
                <img class="searchIcon"
                @click="clickSearch" 
                src="@/assets/search.png"/>
            </div>
        </div>
        <div class="view-content" ref='viewContent' @touchstart="myStart" v-show="viewShow">
            <img class="close" 
            src="@/assets/down.png" 
            @click="myClose"> 
            <my-scroll class="navigationScroll" ref="navigationScroll">
                <div>
                    <div class="hotRec-wrap" v-if="hotSearchData.length">
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
                    <play-list
                    class=needsclick
                    :playListData="searchHistoryData"
                    :title="historyTitle"
                    :hint='historyHint'
                    @myClear="myClearHistory"
                    @myDelete="myDeleteHistory"
                    @mySelect="selectRecKeyword"
                    ></play-list>
                </div>
            </my-scroll>
                    
            <div class="search-list-wrap" ref="listWrap" v-if="listStatus">
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
                <music-list  :loadingStatus="loadingStatus" @selectTarget="selectTarget" :songsListData="searchListData" class="music-list" ref="listScroll"></music-list>
                <div class="noMore" v-show="noMore">没有为您找到相关资源~</div>
                <!-- <router-view name="search"></router-view> -->
            </div>
        </div>

        <div class="recSearch-wrap" v-show='recShow && value.length && recSearchData && recSearchData.length'>
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
import {_creatListData, filterSinger, DATA_TYPE} from 'common/js/creatListData'
import {getSearchHistory, setSearchHistory, deleteSearchHistory, clearSearchHistory} from 'common/js/cache'
import musicList from "base/MusicList"
import myScroll from "base/myScroll"
import PlayList from 'base/playList' 
import {mapActions} from 'vuex'

var $miniPlayerHeight = '45'   //mini播放器高度

export default {
    name: "Search",
    data(){
        return {
            listStatus:true,   //控制list及其中组件的销毁
            viewShow:false,
            historyTitle:'搜索历史',
            historyHint:"暂无搜索历史，快跟iDo浪起来~",
            hotSearchData:[],
            recSearchData:[],
            searchListData:[],
            searchHistoryData:[],
            value:'', 
            myTimer:null,      //用于防抖
            titleTypes:['歌 曲','歌 手','歌 单'],
            currentType:0,     //当前搜索类型
            searchTypes : ['Song','Singer','Mix'],
            allListData:[],
            loadingStatus:false,
            // keyWords:'',
            noMore:false,    //没有资源
            recShow:true,    //控制推荐搜索框的条件之一，主要用于在点击搜索后隐藏
            filterData:[this.creatSongData,this.creatSingerData,this.creatMixData],
        }
    },
    watch:{
        value(){
            this.value ? '' : this.recSearchData=[]   //value发生变化则清空推荐搜索数据
        }
    },
    components:{
        musicList,
        myScroll,
        PlayList
    },
    methods:{
        myFocus(e){                      //input聚焦上弹窗口
            this.viewShow = true
            setTimeout(() => {
                this.$refs.viewContent.style.top = '55px'
            },20)  //异步给时间渲染dom否则监听不到top，也就是改变top时display还是none到block的转化过程
            this.$refs.navigationScroll.scrollTo(0,0,300)
            this.listStatus = true
        },
        myInput(e){                      //防抖监听input 
            clearTimeout(this.myTimer)
            this.myTimer = setTimeout(() => {
                this._getRecSearchData()
                this.recShow = true      //在输入的时候解锁，使得推荐搜索显示
            },400)
            // this.keyWords = this.value
        },
        myClose(){                         //关闭弹窗，downOut
            this.$refs.viewContent.style.top = this.ClientHeight +'px'
            this.$refs.listWrap.style.top = '100%'
            setTimeout(()=>{
                this.listStatus = false
                this.viewShow = false
            },400)
            this.value = ''                //清空value
            this.currentType = 0           //将type归零
            // this.$router.push({path:'/recommend'})
        },
        selectRecKeyword(e){               //点击搜索推荐
            // this.viewShow = true
            // setTimeout(() => {
            //     this.$refs.viewContent.style.top = '55px'
            // },500)  //键盘下滑的时间。
            this.$refs.searchInput.blur()   //让键盘下滑
            var str = e.target.innerText
            this.currentType = 0
            this.searchListData = []
            this.allListData = []
            this.value = str
            this.recShow = false           //搜索时可以关闭推荐搜索
            this._getSearchData()    
            this.listStatus = true      //渲染list及组件并延迟执行style否则报错
            setTimeout(() =>{
                this.$refs.listWrap.style.top = 30 + 'px'
            },20)
        },
        changeType(e){                     //切换搜索type类型
            this.$refs.listScroll.scrollTo(0,0,300)
            this.currentType = e           //控制tab样式
            this.searchListData = []       //每次切换清空当前数组
            this.loadingStatus = false
            if(this.allListData[e] && this.allListData[e].length){    //如果有值则取之前请求过的数据，否则发送请求
                this.searchListData = this.allListData[e]
                return 
            }  
            this._getSearchData()
            // this.$router.push({
            //     params:{type:this.searchTypes[e]},
            //     path:'/searchtypes' + this.searchTypes[e],
            // })
        },
        clickSearch(){                     //点击搜索图标
            this.viewShow = true
            this.currentType = 0
            this.listStatus = true      //渲染list及组件并延迟执行style否则报错
            this.recShow = false           //搜索时可以关闭推荐搜索
            setTimeout(() => {
                this.$refs.viewContent.style.top = '55px'
            },20)
            if(this.value){
                setTimeout(() =>{
                    this.$refs.listWrap.style.top = 30 + 'px'
                    this.allListData = []
                    this.searchListData = []
                    this._getSearchData()
                },20)
            }
        },
        _getSearchData(){                  //搜索数据
            this.noMore = false
            this.loadingStatus = true
            var searchKeyWord = this.value    //保存用于在数据请求后存入缓存
            var type = this.currentType   //保存type，防止在请求过程中被更改，倒是数据格式创建错误
            this.value && getSearchData(this.value,type).then(res=> {
                this.searchHistoryData = setSearchHistory(searchKeyWord)    //不管搜索成功与否都保存记录，因为关键词搜索歌曲没有可能有歌单，歌手
                if(res.statusText === STATUS_TEXT){
                    this.loadingStatus = false
                    if(res.data.result.songCount == 0 ){

                        this.noMore = true        //如果数量为0说明没有数据，提示用户
                        return
                    }
                    this.allListData[type] =  this.filterData[type](res)    //用对应的函数处理对应类型的数据格式
                    this.searchListData = this.allListData[type]
                }
            })
        },
        selectTarget(ops){
            this.$refs.searchInput.blur()    
            if(ops.type != 'Song'){
                 this.$router.push({
                    name:'songListPage',
                    params:{
                        type:ops.type,
                        id:ops.id
                    }
                })
            // this.myClose()
            }else if(ops.type === 'Song'){
                this.selectPlay({list:this.searchListData, index:ops.index,id:ops.id})
            }
        },
        ...mapActions([
            'selectPlay'
        ]),
        
        creatSongData(data){              //创建song数据格式
            data = data.data.result.songs
            var newData = [] 
            data.forEach((item, index) => {
                var album = filterSinger(item.artists,item.album.name)
                newData.push(new _creatListData(undefined,  item.name, album, item.id ,DATA_TYPE[0]))
            })
            return newData;
        },
        creatSingerData(data){
            data = data.data.result.artists
            var newData = [] 
            data.forEach((item, index) => {
                newData.push(new _creatListData(item.img1v1Url,  item.name,undefined, item.id ,DATA_TYPE[1]))
            })
            return newData;
        },
        creatMixData(data){
            data = data.data.result.playlists
            var newData = [] 
            data.forEach((item, index) => {
                var arr = [item.creator.nickname]
                var album = 'by:' + item.creator.nickname + ' - ' + item.playCount + '次播放'
                newData.push(new _creatListData(item.coverImgUrl, item.name, album, item.id ,DATA_TYPE[2]))
            })
            return newData;
        },


        _getRecSearchData(){               //获取搜索推荐数据
                //有值的时候才发送请求
                this.value &&  getRecSearchData(this.value).then(res=> {
                    if(res.statusText === STATUS_TEXT){
                        this.recSearchData = res.data.result.allMatch
                    }
                })
        },
        myDeleteHistory(index){               //删除某条搜索历史
            this.searchHistoryData = deleteSearchHistory(index)
        },
        myClearHistory(){           //清除全部搜索历史
            this.searchHistoryData = clearSearchHistory()
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
            this.$refs.viewContent.style.height = this.ClientHeight - 55 -$miniPlayerHeight + 'px'
        },
        myStart(){
            this.recShow = false   
        }
    },
    created(){
        this._getRecSearch(),
        this.searchHistoryData = getSearchHistory()
    },
    mounted(){
        this._initHeight()
        // window.addEventListener('resize', () => {      //监听resize事件，屏幕尺寸变化时候触发，从而重新初始化
            //  this._initHeight()
        // })
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
            background white
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
            // bottom $miniPlayerHeight
            width 100%
            z-index 988
            background rgba(250,250,250,1)
            border-radius 15px 15px 0 0
            transition top 0.3s
            .close
                position absolute 
                right 15px
                top 5px
                width 23px
            .navigationScroll
                width 100%
                position absolute
                top 30px
                bottom 0
                overflow hidden
                .hotRec-wrap
                    width 100%
                    margin-bottom 20px
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
                
            .search-list-wrap
                position absolute
                top 100%
                left 0
                bottom 0
                width 100%
                background white
                transition top 0.4s
                .music-list
                    position absolute 
                    top 35px
                    bottom 0
                    width 100%
                    overflow hidden
                    // background-image url('../../assets/BgImage1.png')
                    // background-size cover
                .type-wrap
                    box-sizing border-box
                    width 100%
                    height 35px
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
                .noMore
                    width 100%
                    text-align center
                    padding 10px 0
                    color #bbb
                    font-size 15px
        .recSearch-wrap
            position absolute 
            box-sizing border-box
            background white
            z-index 998
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
