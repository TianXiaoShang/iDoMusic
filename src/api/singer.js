import myAxios from "common/js/axios"

export default function getSingerData (cat){
    var url = "api/artist/list"
    url = cat == undefined ? "api/top/artists" : url    //默认获取热门歌手
    var params = {
        limit:100,
        cat
    }
    return myAxios(url,params)
}