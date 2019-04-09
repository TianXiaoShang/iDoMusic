<template>
    <div class="wrap">
        <transition name="fullPlayer">
            <div 
            class="player" 
            v-show="showPlayer" 
            >
                <div class="background-image">
                    <img v-lazy="`${musicData.imageUrl}?param=800y800`" :key='musicData.imageUrl' alt="" class="bg-img">
                    <div class="bg-filter"></div>
                </div>
                //back区域
                <div class="title">
                    <div class="back">
                        <img src="@/assets/downWhite.png" alt="" class="back-icon" @click="backClick">
                    </div>
                </div>
                
                //player首页
                <transition :name="myShowPage">
                    <div class="music-detail" v-show="showPage"
                    @touchstart="onTouchStart"
                    @touchend="onTouchEnd">
                        <div class="music-name">{{musicData.name}}</div>
                        <div class="cover">
                            <div class="border">
                                <img :class="{play:playStatus == true,'play pause':playStatus == false}" v-lazy="`${musicData.imageUrl}?param=300y300`" :key='musicData.imageUrl' class="img">
                            </div>
                        </div>
                        <div class="music-info">
                            <div class="singer-ablum">{{musicData.album}}</div>
                            <div v-if="Object.keys(this.musicData).length" class="currentTxt">{{currentTxt}}</div>
                        </div>
                        <div class="proBar" v-if="Object.keys(this.musicData).length">
                            <progress-bar @changePerc="changePerc" :currentTime="currentTime" :audioDur="audioDur" :percentage="percentage"></progress-bar>
                        </div>
                    </div>
                </transition>

                //player歌词页
                <transition :name="myShowPage" >
                    <div class="music-lysic" v-show="!showPage"
                    @touchstart="onTouchStart"
                    @touchend="onTouchEnd">
                        <div class="musicName">{{musicData.name}}</div>
                        <div class="lyricHint" v-if="!myLyric">未找到歌词哦~~~</div>
                        <my-scroll class='lyricScroll' ref="lyricScroll">
                            <div class="lyricContent">
                                <div v-if="myLyric" class='myLyric'>
                                    <p 
                                    :class="{currentLyric: lineNum === index}" 
                                    ref="lyricItem" 
                                    class="lyricItem" 
                                    v-for="(item, index) in myLyric.lines" 
                                    :key="index">{{item.txt}}</p>
                                </div>
                            </div>
                        </my-scroll>
                    </div>
                </transition>

                //controls控制区
                <div class="controls">
                    <img @click="changeMode" v-show="mode === 'sequence'" src="@/assets/sequence.png" alt="" class="model">
                    <img @click="changeMode" v-show="mode === 'random'" src="@/assets/random.png" alt="" class="model">
                    <img @click="changeMode" v-show="mode === 'loop'" src="@/assets/loop.png" alt="" class="model">
                    <img @click="playPrevious" src="@/assets/previous.png" alt="" class="previous">
                    <img @click="changePlayStatus" v-show="!this.playStatus" src="@/assets/play.png" alt="" class="play">
                    <img @click="changePlayStatus" v-show="this.playStatus" src="@/assets/pause.png" alt="" class="play">
                    <img @click="playNext" src="@/assets/next.png" alt="" class="next">
                    <img @click="myShowPlayList" src="@/assets/list.png" alt="" class="list">
                </div>
            </div>
        </transition>
        <transition name="fullPlayer">
            <div v-show="showPlayList" class="showPlayList" ref="showPlayList">
                <img @click="myShowPlayList" src="@/assets/down.png" alt="" class="closeList">
                <div class="play-list-title">
                    <div class="title-name">{{title}}（{{showPlayListData.length}}）</div>
                    <img src="@/assets/clear.png" alt="" 
                    class="clear-icon" 
                    @click="clearPlayList">
                </div>
                <my-scroll :data="showPlayListData" class="contentWrap">
                    <play-list
                    ref="myPlayList" 
                    :currentIndex="myPlayListCurrentIndex"
                    :hint="hint"
                    :playListData="showPlayListData" 
                    @myDelete="deletePlayList"
                    @mySelect="selectPlayList"></play-list>
                </my-scroll>
            </div>
        </transition>
        <transition name="fullPlayer">
            <div class="playMini" v-show="!showPlayer" @click="myFullPlay">
                <img :class="{play:playStatus == true,'play pause':playStatus == false}" :src="musicData.imageUrl" alt="" class="miniImg">
                <div class="miniInfo">
                    <div class="miniName">{{musicData.name || '快跟iDo浪起来'}}</div>
                    <div class="miniAblum">{{currentTxt || musicData.album}}</div>
                </div>
                <img @click.stop="changePlayStatus" v-show="!this.playStatus" src="@/assets/play2.png" alt="" class="miniPlay">
                <img @click.stop="changePlayStatus" v-show="this.playStatus" src="@/assets/pause2.png" alt="" class="miniPlay">
                <img @click.stop="myShowPlayList" src="@/assets/list2.png" alt="" class="miniList">
            </div>
        </transition>
        <audio 
            ref="audio" 
            :src="musicUrl" 
            @canplay="canplay"
            @error="error" 
            @timeupdate="timeupdate"  
            @ended="ended"
            ></audio>
    </div>
</template>



// 整体思路：

// 1.使用vuex。传递给state的值为playList/index/id，这里我监听点击的music-ID，当id改变则进行播放操作。

// 2.然后设置两个播放列表，一个为列表传过来的原数组（数组则是由排行榜/歌单/搜索列表/歌手等页面传递过来的整页的数据），一个为实际用来播放的数组

// 3.监听mode,用来播放的实际数组受模式的影响，如模式切为随机播放，则将播放列表进行打乱，非随机播放则重新赋值原数组。

// 4.主要逻辑是维护一个index，首先需要说明的是：在切歌的点击事件中仅进行index的++ --（更改index后，通过index查找并赋值musicID，从而触发监听musicID的init函数进行播放），不在切歌时考虑模式等逻辑操作；

// 5.当模式改变为随机播放，数组打乱的同时通过当前歌曲的id查找到当前播放的歌曲在改变后的打乱的放列表中的index，进行新的index赋值，使得播放顺序在打乱数组中有序进行，当然反正是随机，这里不管index也行，不管的话就是使用之前的index；我有强迫症。哪怕是随机模式，也希望index在我的掌控中！

// 6.当模式切回为非随机播放时，则将原数组对用来播放的数组进行重新赋值。给予一个顺序的数组。但是，在这里必须进行index的维护，将当前正在播放的歌曲在顺序数组中的index取出并赋值，下一曲将在该index上进行增减。（比如随机播放到随机列表的第八首，但该歌曲在顺序数组中为第三首，模式切回来能跟着第四首开始播放，而不会无厘头的去播放顺序数组中的第九首）

// 7.切换歌曲，上面提到仅仅对index进行管理，但是需要注意的是，模式不同，index对应的歌曲不同，这里获取到++后者--后的index，取出实际播放列表中的index项即可，因为实际播放列表受模式监听影响。

// 8.用户手动点击时不需要进行index管理，因为点击操作已经自动传递index；
// （这里是该思路最大的优点也是最友好的地方，用户不论在任何模式下手动点击歌曲，既不需要维护index，也不需要维护playList,请求数据依赖于musicID,index自动修正）




<script>
import {getMusicDetailData, getMusicUrlData, getMusicLyricData} from 'api/music'
import {STATUS_TEXT} from 'api/config'
import {mapGetters,mapMutations} from 'vuex'
import playList from 'base/playList'
import Lyric from 'lyric-parser'
import myScroll from 'base/myScroll'
import progressBar from 'base/progressBar'

export default {
    name:'Player',
    data(){
      return {
          myPlayListCurrentIndex:-1,
          musicData:{},
          miniUrl:"url('../../assets/BgImage1.png')",   //手动lazy的旋转CD图
          miniUrl2:'@/assets/BgImage1.png',
          musicUrl:'',
          myMode:['sequence','random','loop'],
          showPlayList:false,
          showPlayListData:[],
          title:"播放列表",
          continueId:[],                   //保存通过播放列表操作删除后的id，当切歌为改歌曲时index++跳过
          hint:'播放列表为空啦~~，快跟iDo浪起来~~~',
          cdClass:'pause',
          myLyric:null,                     //lyric实例
          firstX:0,                         //用于判断滑动操作
          laseX:0,
          offsetX:0,                         //根据差值的正负判断方向以及大小判断是否切换
          showPage:true,
          myShowPage:'',                      //动画名字
          currentTxt:'',                      //当前正在播放的歌词
          lineNum:0,                          
          audioDur:0,                         //音频长度（秒）
          percentage:0,                       //播放百分比
          currentTime:0,                      //当前播放时长
          lyricLock:false,
          timer: false
      }  
    },
    components:{
        playList,
        myScroll,
        progressBar
    },
    computed:{
        ...mapGetters([
            'showPlayer',
            'sequenceList',
            'playStatus',
            'currentIndex',
            'playList',
            'mode',
            'musicId'
        ])
    },
    created(){    //该监听方法为length + index,不行，out,等等！！！如果加上JSON.stringify呢？
        // this.$watch(() => JSON.stringify(this.playList) + this.musicId,(val,oldVla) => this._checkData())
        this.$watch(() => this.musicId,(val,oldVla) => this._initData())    //只需要监听音乐id即可
        // document.getElementById('app').addEventListener('touchstart',this.handlePlay,false)  
    },
       
    watch:{
    //     currentIndex(){                //同时监听list跟index，其中任何一个改变，都说明更改了播放曲目
    //         this._checkData()
    //     },
        offsetX(newVal){
            if(newVal < 0 && Math.abs(newVal) > 100){
                this.myShowPage = 'showPageRight'
                this.showPage = !this.showPage
                var currentItem = this.lineNum ? this.$refs.lyricItem[this.lineNum - 4] : ''     //歌词跳转到中间部分
                this.$refs.lyricScroll.scrollToElement(currentItem,500,0,0)

            }else if(newVal > 0 && Math.abs(newVal) > 100){
                this.myShowPage = 'showPageLeft'
                this.showPage = !this.showPage
                var currentItem = this.$refs.lyricItem[this.lineNum - 4]     //歌词跳转到中间部分
                this.$refs.lyricScroll.scrollToElement(currentItem,500,0,0)

            }
        },
        playList(){
            this.set_sequenceList(this.playList)
            this.mode === 'random' ? this.randomList() : ''    //进入新的列表页，重新赋值playList并判断是否为random，是则执行打乱从操作
            var newArr = []
            this.sequenceList.forEach((item ,index) => {       //这里进行miniplaylist数据名字赋值
                newArr.push(item.name)
            })
            this.showPlayListData = newArr
        },
        mode(){                          //模式变化后打乱数组
            if(this.mode == 'random'){   //随机播放打乱数组赋值sequence并修改在随机列表中的所在index   
               this.randomList()
            }else{                       //不是随机模式则恢复数组并将index修改至当前歌曲在非乱序list中的实际index，以至于下一曲的时候能够依次往后播放
                this.set_currentIndex(this.myFadeIndex(this.playList))
                this.set_sequenceList(this.playList)
            }
        },
        sequenceList(){
            this.miniPlayList = JSON.stringify(this.sequenceList)
        }
    },
    
    methods:{
        randomList(){                                       //随机模式将进行数据更替
            var arr = JSON.parse(JSON.stringify(this.playList))
            arr.sort((a,b) => {
                return Math.random() - 0.5
            })
            this.set_currentIndex(this.myFadeIndex(arr))    //随机播放将当前播放的歌曲在随机数组中的index进行赋值
            this.set_sequenceList(arr)
        },
        _initData(){                        //musicId改变，开始准备数据
            if(this.myLyric){               //有歌词的情况下首先清除上一曲的歌词
                this.myLyric.stop()
                this.myLyric = null             //先将上一次的歌词数据清除
                this.currentTxt = ''
                this.lineNum = 0
                this.audioDur = 0
                this.currentTime = 0
            }
            this.set_playStatus(true)
            this.showPage = true            //切歌后不返回歌词页
            this.$refs.audio.pause()        //数据请求完之前先暂停之前歌曲
            var index = this.sequenceList.findIndex(item => {              //从列表中查找到当前歌曲的index
                return item.id === this.musicId
            })
            this.sequenceList.length &&  this._getMusiImage(this.musicId)     //这里主要获取图片url跟时长（search的数据没有img）
            this.musicData = this.sequenceList[index]    //先把歌曲详情渲染出来
            this._getMusicUrl(this.musicData.id)         //然后请求歌曲rul
            this._getMusicLyric(this.musicData.id)       //请求歌词
            this.playListScrollTo()                      //将小播放列表跳转到当前歌曲位置
            // this.set_currentIndex(this.myFadeIndex(this.sequenceList))    //点击时index肯定是正常的，而在切歌时，已经修正，所以这里没必要再次修正
        },
        _getMusiImage(id){
            getMusicDetailData(id).then(res => {
                if(res && res.statusText === STATUS_TEXT){
                    this.audioDur = res.data.songs[0].dt / 1000             //毫秒  =》 秒
                    this.musicData.imageUrl = res.data.songs[0].al.picUrl
                }
            })
        },
        _getMusicUrl(id){
            getMusicUrlData(id).then(res => {
                if(res && res.statusText === STATUS_TEXT){
                    this.musicUrl = res.data.data[0].url
                    setTimeout(() =>{
                        if(this.playStatus && !this.lyricLock){
                            this.$refs.audio.play()
                            this.set_playStatus(true)
                        }                   //强行兼容canpaly无效,手动模拟两次点击
                    },3000)                 //三秒后还未播放将尝试手动播放
                }
            })
        },
        // handlePlay(){
        //     if(this.playStatus && !this.lyricLock){
        //         this.$refs.audio.play()
        //         // this.set_playStatus(true)
        //     } 
        // },
        _getMusicLyric(id){
                getMusicLyricData(id).then(res => {
                     if(res && res.statusText === STATUS_TEXT && res.data.lrc){
                         this.myLyric = new Lyric(res.data.lrc.lyric,this.handleLyric)
                         this.myLyric.stop()    //首先初始化为stop
                         if (this.playStatus && this.lyricLock) {        //如果歌曲慢请求回来将等待,如果歌曲已开始播放，则直接跳转到对应的位置。
                            this.myLyric.seek(this.$refs.audio.currentTime * 1000)    //主要用于在歌词请求过慢时纠正位置
                        }
                    }
                })
        },
        handleLyric(ops){                                 //处理lyric派发的歌词函数
            this.currentTxt = ops.txt
            this.lineNum = ops.lineNum
            // console.log(ops)
            var currentItem = this.lineNum ? this.$refs.lyricItem[this.lineNum - 4] : ''  //歌词跳转到中间部分
            if(this.lineNum > 5){
                this.$refs.lyricScroll.scrollToElement(currentItem,500,0,0)
            }else{
                this.$refs.lyricScroll.scrollTo(0,0,500)
            }
        },
        changePlayStatus(){                               //播放暂停
            if(!Object.keys(this.musicData).length){      //清除播放列表后，对象为空。防止报错
                return
            }
            if(this.playStatus){
                this.$refs.audio.pause()
            }else{
                this.$refs.audio.play()
            }
            this.myLyric && this.myLyric.togglePlay()                    //歌词的暂停/播放，将俩联合在一起
            this.set_playStatus(!this.playStatus)
        },
        changeMode(){                                    //切换播放模式
            var index = this.myMode.findIndex((item) =>{
                return item === this.mode
            })
            index = index === 2 ? 0 : ++ index
            this.set_mode(this.myMode[index])
        },
        
        playNext(){                     //下一曲
            var index = this.currentIndex
            // this.set_playStatus(true)    //切换曲目都自动改成播放状态
            if(this.currentIndex === this.sequenceList.length -1){
                this.set_currentIndex(0)
            }else{
                this.set_currentIndex(++ index)
            }
            var lock = this.handleContinue()
            if(lock){                       //如果有的话查看是否为被删除，删除则进行下一曲
                this.playNext()
                return
            }
            this.set_musicId(this.sequenceList[this.currentIndex].id)
        },
        playListScrollTo(){
            var currentName = this.sequenceList[this.currentIndex].name;
            var currentIndex = this.showPlayListData.findIndex(item => {
                if (item === currentName){
                    return true
                }
            })
            this.myPlayListCurrentIndex = currentIndex
            // this.$refs.myPlayList.scrollToElement(currentIndex)
        },
        
        playPrevious(){            //上一曲
            var index = this.currentIndex
            this.set_playStatus(true)    //切换曲目都自动改成播放状态
            if(this.currentIndex <= 0){
                this.set_currentIndex(this.sequenceList.length - 1)
            }else{
                this.set_currentIndex(-- index)
            }
            var lock = this.handleContinue()
            if(lock){
                this.playPrevious()
                return
            }
            this.set_musicId(this.sequenceList[this.currentIndex].id)
        },
        handleContinue(){
            try{
                this.continueId.forEach((item,index) => {       //查找切换后即将播放的歌曲是否在播放列表被删除
                    if(item === this.sequenceList[this.currentIndex].id){
                        throw new Error('StopContinueId')
                    }
                })
            }catch(e){
                if (e.message !== 'StopContinueId')  throw e
                return true
            }
            return false
        },
        canplay(){                                               //数据为可播放状态
            // this.audioDur = this.$refs.audio.duration    //获取音乐长度
            // console.log(this.audioDur)
            if(this.playStatus){
                this.$refs.audio.play()     
                this.lyricLock = true;
                this.myLyric && this.myLyric.seek(this.$refs.audio.currentTime * 1000)    //如果歌词先请求回来了。那就在可以播放时播放歌词
            }
            // if(this.myLyric){                                     //防止歌词请求比歌曲慢而报错
                // this.myLyric.play()                               //调用插件的play()方法，进行歌词播放
                // console.log(1212)
            // }
            
        },
        changePerc(e){                                            //拖动跳转歌词跟歌曲进度
            var timer = this.audioDur * e
            this.$refs.audio.currentTime = timer
            this.$refs.audio.play()
            this.set_playStatus(true)
            this.myLyric.seek(this.$refs.audio.currentTime * 1000)  //跳转 
        },
        error(){                                                  //数据请求失败
            console.log('error')
            // this.playNext()
        },
        timeupdate(e){                                            //播放进度更新，获取当前播放进度
            this.currentTime = e.target.currentTime  //当前播放时间
            // if(!this.timer){                 //节流处理
            //     this.timer = true
            //     setTimeout(() => {
            //         this.lyricLock && this.myLyric && this.playStatus && this.myLyric.seek(this.$refs.audio.currentTime * 1000)  //跳转不了？？？？？？？？？？？？？
            //         this.timer = false    //开始下一次计时
            //     },20)
            // }
        }, 
        ended(){                                                  //播放结束，先判断是否为单曲循环，否则自动播放下一曲
            if(this.mode === 'loop'){   
                this._initData()                                  //单曲循环则id不变重复执行init操作即可
                return
            }
            this.playNext()
        },
        myFullPlay(){
            this.set_showPlayer(true) 
        },
        backClick(){                  //关闭全屏播放器，显示mini播放器
            this.set_showPlayer(false) 
            this.showPlayList = false  //关闭全屏时顺便关闭播放列表
        },  
        myShowPlayList(){
            this.showPlayList = !this.showPlayList
            if(!this.playList.length){
                return
            }
            setTimeout(() => this.playListScrollTo() ,20)
            //打开列表的时候也要跳转一次
        },
        myFadeIndex(arr){            //传入数组，找到当前播放曲目在该数组中的index
            var index = arr.findIndex(item => {
                return item.id === this.sequenceList[this.currentIndex].id
            })
            return index
        },
        ...mapMutations({
            set_showPlayer:'set_showPlayer',
            set_playStatus:'set_playStatus',
            set_currentIndex:'set_currentIndex',
            set_mode:'set_mode',
            set_sequenceList:'set_sequenceList',
            set_musicId:'set_musicId',
            set_playList:'set_playList'
        }),




        clearPlayList(){         //清除播放列表，停止播放，同时关闭播放器
            this.set_playList([])
            this.currentTxt = ''
            this.musicUrl = ''
            this.backClick()
            this.set_playStatus(false)
            this.musicData = {}
        },
        deletePlayList(index){              //通过index找到name,通过name查找到id。随后删除后的这个保存id
            var musicName = this.showPlayListData[index]
            var musicId;
            this.sequenceList.forEach(item => {
                if(item.name === musicName){
                    musicId = item.id
                }
            })
            this.showPlayListData.splice(index, 1)    //先将删除后的id保存用于跳过播放，再删除该位
            if(!this.showPlayListData.length){        //先判断删除后数组还有没有数据，如果没有则关闭所有
                this.clearPlayList()     
                return    
            }
            this.continueId.push(musicId)
            musicId === this.musicId ?  this.playNext() :''    //如果删除的是正在播放的歌曲则播放下一首
            setTimeout(() => this.playListScrollTo() ,20)      //删除前面的会造成样式错乱。需要重新to
        },
        selectPlayList(e){
            this.set_playStatus(true)
            var musicName = e.target.innerText;
            var myId, myIndex;
            this.sequenceList.forEach((item,index) => {      //通过名字找到id.变更id进行播放，同时修正index
                if(item.name === musicName){
                    myId = item.id
                    myIndex = index
                }
            })
            this.set_musicId(myId)
            this.set_currentIndex(myIndex)
        },

        onTouchStart(e){
            if(Object.keys(this.musicData).length){
                this.firstX = e.changedTouches[0].pageX
            }
        },
        onTouchEnd(e){
            if(Object.keys(this.musicData).length){
                this.lastX = e.changedTouches[0].pageX
                this.offsetX = this.lastX - this.firstX
            }
        },
        // scrollToElement(index){
        //     this.currentIndex = index
        //     setTimeout(() => {
        //         if(this.$refs.listItem){
        //             var currentMusic = this.$refs.listItem[index]
        //             this.$refs.myScroll.scrollToElement(currentMusic,250,0,-143)
        //         }
        //     },20)
        // }
    }
}
</script>


<style lang="stylus" scoped>
@import "~common/styles/variable"
.wrap
    width 100%
    .fullPlayer-enter-active,
    .fullPlayer-leave-active
        will-change transform
        transition  all 300ms
        position absolute
    .fullPlayer-enter
        opacity: 0;
        transform: translate3d(0%,100%, 0);
    .fullPlayer-leave-active
        opacity: 0;
        transform: translate3d(0%,100%, 0);
    .player
        position fixed
        top 0
        left 0
        bottom 0
        right 0
        z-index 990
        // width 100%
        // height 100%
        background black
        .background-image
            position relative
            width 100%
            height 100%
            .bg-filter
                position absolute
                top 0
                left 0
                bottom 0
                right 0
                // background linear-gradient(to bottom, rgba(99,64,74,0.8) 0%,rgba(99,64,74,0.6) 20%,rgba(99,64,74,0.7) 40%,rgba(99,64,74,0.85) 50%,rgba(99,64,74,0.95) 70%,rgba(99,64,74,1) 100%);
            .bg-img
                height 100%
                position absolute
                left -40%
                background-size cover
                background-position 50% 0%
                // transform translate(-50%)
                // left -50%
                // top -5px      //用于隐藏高斯模糊边上的黑边
                // height 102%   //用于隐藏高斯模糊边上的黑边
                background-image url('../../assets/BgImage3.png')
                filter blur(3px) opacity(32%)

        .title
            width 100%
            height 28px
            padding 15px
            position absolute 
            top 0
            left 0
            z-index 500
            .back
                width 100%
                height 100%
                .back-icon
                    height 100%
        .showPageLeft-enter-active,
        .showPageLeft-leave-active,
        .showPageRight-enter-active,
        .showPageRight-leave-active 
            will-change transform
            transition all 500ms
            position absolute
        .showPageLeft-enter
            opacity 0
            transform translate3d(-100%,0%, 0)
        .showPageLeft-leave-active
            opacity 0
            transform translate3d(100%,0%, 0)
        .showPageRight-enter
            opacity 0
            transform translate3d(100%,0%, 0)
        .showPageRight-leave-active
            opacity 0
            transform translate3d(-100%,0%, 0)    
        .music-lysic
            position absolute
            left 0
            top 0
            bottom 120px
            right 0
            color white
            .musicName 
                margin-top 17px
                font-size 16px
                color white
                text-align center
                padding 0 50px
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
            .lyricHint
                text-align center
                color #eee
                font-size 15px
                margin 250px auto
            .lyricScroll
                position absolute
                top 50%
                transform translate3d(0,-40%,0)
                height 75%
                width 100%
                overflow hidden
                .lyricContent
                    width 100%
                    text-align center
                    .myLyric
                        width 100%
                        .lyricItem
                            color #aaa
                            box-sizing border-box
                            padding 10px 15px
                            &.currentLyric
                                color white
        .music-detail
            position absolute
            left 0
            top 0
            bottom 110px
            right 0
            color white
            .music-name
                box-sizing border-box
                width 100%
                padding 0 15px
                margin-top 60px
                text-align center
                font-size 16px
            .cover
                position absolute
                top 130px
                left 0
                right 0
                margin 0 auto
                width 65%
                border-radius 50%
                overflow hidden
                border 8px solid rgba(200,200,200,0.3)
                .border
                    position relative
                    box-sizing border-box
                    width 100%
                    height 0
                    padding-bottom 100%
                    background-image url('../../assets/lazy3.png')
                    background-size cover
                    .img
                        position absolute
                        top 0
                        display block
                        bottom 0
                        width 100%
                        border-radius 50%
                        &.play
                            animation rotate 20s linear infinite
                            //cd暂停功能的实现
                        &.pause
                            animation-play-state paused   
            .music-info
                width 100%
                position absolute
                bottom 40px
                text-align center
                font-size 14px
                color #ccc
                .singer-ablum
                .currentTxt
                    padding 10px 15px
                .currentTxt
                    height 40px
                    font-size 16px
                    line-height 25px
                    color white
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; //行数
                    -webkit-box-orient: vertical;
            .proBar
                position absolute
                bottom 0
                left 0
                right 0
                margin 0 auto 
                padding 0 10px
                // height 30px
                // border 1px solid #eee
                // border-radius 8px
        .controls
            position absolute 
            bottom 30px
            display flex
            width 100%
            height 60px
            justify-content space-around
            align-items center
            & img 
                width 13%
    .showPlayList
        background white
        width 100%
        position absolute
        bottom 0
        height 350px
        padding-top 40px
        border-radius 12px 12px 0 0 
        z-index 992
        .closeList
            width 25px
            position absolute
            left 0
            right 0
            top 8px
            margin 0 auto
        .play-list-title
            display flex
            justify-content space-between
            align-items center
            height 30px
            margin 0px 20px
            border-bottom 1px solid $themeColor
            box-sizing border-box
            .title-name
                font-weight 600
                color $themeColor
                font-size 18px
            .clear-icon
                width 25px
        .contentWrap
            position absolute
            top 70px
            bottom 0
            left 0
            right 0
            overflow hidden
    .playMini
        position fixed
        bottom 0
        left 0
        right 0px
        z-index 991
        height $miniPlayerHeight
        background white
        border-top 0.5px solid #eee
        // box-shadow -8px 0px 4px 4px #ccc
        display flex
        align-items center
        .miniImg
            width 42px
            height 42px
            border-radius 50%
            background-image url('../../assets/lazy3.png')
            background-size cover
            &.play
                animation rotate 20s linear infinite
                //cd暂停功能的实现
            &.pause
                animation-play-state paused   
        .miniInfo
            flex-grow 1
            width 60%
            height 100%
            display flex
            flex-direction column
            justify-content center
            .miniName
            .miniAblum 
                color rgb(50,50,50)
                font-size 16px
                padding 1px 15px
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
            .miniAblum 
                color #888
                font-size 12px
        .miniPlay
            width 45px
            height 45px
        .miniList
            width 45px
            height 45px   



@keyframes rotate
    0%
        transform: rotate(0)
    100%
        transform: rotate(360deg)            
</style>
