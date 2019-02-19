import myAxios from "common/js/axios"

export default function getRecSongListData(limit,before){
    var url = 'api/personalized'    //获取推荐歌单地址
    // var url = 'api/top/playlist/highquality'
    var params = {
        limit:6
    }
    return myAxios(url,params)
}