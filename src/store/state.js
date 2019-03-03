const state = { 
    showPlayer:false,    //窗口状态
    playList:[],         //当前列表的原始所有歌曲数据
    currentIndex:-1,     //当前播放的歌曲在列表中的index
    playStatus:false,    //播放暂停与否
    mode:'sequence',     //播放模式
    sequenceList:[],     //播放列表，主要用于储存随机播放列表
    musicId:''           //当前播放的歌曲id
}
export default state