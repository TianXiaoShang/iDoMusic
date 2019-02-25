import myAxios from "common/js/axios"

export function getMixListData(id){
    var url = 'api/playlist/detail'
    var params = {
        id
    }
    return myAxios(url,params)
}

export function getRankListData(id){
    var url = 'api/top/list'
    var params = {
        id
    }
    return myAxios(url,params)
}

export function getSingerListData(id){
    var url = 'api/artists'
    // var url = 'api/artist/desc'   //获取歌手描述API
    var params = {
        id
    }
    return myAxios(url,params)
}