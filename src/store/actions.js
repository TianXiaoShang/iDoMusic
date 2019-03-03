export const selectPlay = function ({commit, state},{list,index,id}){
    commit('set_playList',list)
    commit('set_currentIndex',index)
    commit('set_showPlayer',true)
    commit('set_playStatus',true)
    commit('set_musicId', id)
}