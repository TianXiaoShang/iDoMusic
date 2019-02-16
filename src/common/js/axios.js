import Axios from "axios"

export default function myAxios(url,params){
    url = handle(params) ? url+= (url.indexOf('?') == -1 ? '?' : '&') + handle(params) : url
    return Axios.get(url)
}

function handle(params){
    var arr = [];
    for(var key in params){
        arr.push(params[key] == undefined ? '' :key + '=' +  encodeURIComponent(params[key]))
    }
    return arr.join('&')
}