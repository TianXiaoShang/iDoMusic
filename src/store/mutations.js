const mutations = {
    set_showPlayer(state, status){
        state.showPlayer = status
    },
    set_playList(state, list){
        state.playList = list
    },
    set_currentIndex(state, num){
        state.currentIndex = num
    },
    set_playStatus(state, module){
        state.playStatus = module
    },
    set_sequenceList(state, list){
        state.sequenceList = list
    },
    set_mode(state, mode){
        state.mode = mode
    },
    set_musicId(state, id){
        state.musicId = id
    }
}

export default mutations;