import myAxios from "common/js/axios"

export default function getRecommendData(){
    var url = '/api/banner';
    return myAxios(url)
}