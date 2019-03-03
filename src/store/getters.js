export const showPlayer = state => state.showPlayer
export const playList = state => state.playList
export const currentIndex = state => state.currentIndex
export const playStatus = state => state.playStatus
export const mode = state => state.mode
export const musicId = state => state.musicId

// export const sequenceList = state => state.sequenceList

export const sequenceList = state => state.sequenceList

function sortList(mode,list){
    if(mode !== 'random'){
        return list
    }else{
        return list.sort((a,b) => {
            return Math.random() - 0.5;
        })
    }
}