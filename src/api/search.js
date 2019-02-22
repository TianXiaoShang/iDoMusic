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

export function getSearchData(keywords){
    var parmas = {
        keywords,
        limit:30
    }
    var url = 'api/search/'
    return myAxios(url,parmas)
}