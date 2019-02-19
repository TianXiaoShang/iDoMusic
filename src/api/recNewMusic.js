import myAxios from "common/js/axios";

export default function getRecNewMusicData(){
    let url = 'api/personalized/newsong'
    return myAxios(url)
}