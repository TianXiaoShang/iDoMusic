import myAxios from "common/js/axios"

export function getMusicDetailData(id){
    var url= "api/song/detail"
    var params = {
        ids:id
    }
    return myAxios(url, params)
}
export function getMusicUrlData(id){
    var url= "api/song/url"    //歌曲的url
    var params = {
        id
    }
    return myAxios(url, params)

}

export function getMusicLyricData(id){
    var url= "api/lyric"
    var params = {
        id
    }
    return myAxios(url, params)

}