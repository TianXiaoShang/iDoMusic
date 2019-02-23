import myAxios from 'common/js/axios'

export function getHotRecSearchData(){
    var url = 'api/search/hot'
    return myAxios(url)
}

export function getRecSearchData(keywords){
    var params = {
        keywords,
        type:'mobile'
    }
    var url = 'api/search/suggest'
    return myAxios(url,params)
}

export function getSearchData(keywords,type=0){
    var obj = [1,100,1000]
    var parmas = {
        keywords,
        limit:50,
        type:obj[type]
    }
    var url = 'api/search/'
    return myAxios(url,parmas)
}