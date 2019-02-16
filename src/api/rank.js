import myAxios from "common/js/axios"

export default function getRankData(){
    // var url = '/api/toplist/artist';
    // var url = '/api/discover/toplist?id=3778678';
    // var url = '/api/top/artists?offset=0&limit=300';
    // var url = '/api//artists?id=5781';

    
    
    // var url = '/api/top/list?id=991319590';   //传榜单id获取歌曲列表等信息
    var url = '/api/toplist/detail';   //移动端带三个详情
    
    
    
    return myAxios(url)
}