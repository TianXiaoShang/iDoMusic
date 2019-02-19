import myAxios from "common/js/axios"

export default function getBannerData(){
    var url = '/api/banner';
    return myAxios(url)
}