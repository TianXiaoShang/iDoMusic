import myAxios from "common/js/axios"

export function getCategoryData(){
    var url = '/api/playlist/catlist';      //歌单分类tag
    // var url = '/api/playlist/detail?id=2664283969';   //歌单湘情
    // var url = '/api/top/playlist/highquality';   ?/精品歌单

    return myAxios(url)
}

export function getSongsData(type){
    var url = '/api/top/playlist'
    var params = {
        cat:type
    }
    return myAxios(url,params)
}