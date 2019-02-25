import storage from 'good-storage'


const STORAGE_MAX_LENTH = 20
const SEARCH_KEY = '_searchData_'

export function getSearchHistory () {      //获取storage，如果没有则返回空数组一枚
    return storage.get(SEARCH_KEY, [])
}

export function setSearchHistory (val) {   //保存记录，返回保存后的新数组
    var arr = getSearchHistory()
    insetHistory(arr,val,item => {
        return item === val
    },STORAGE_MAX_LENTH)
    storage.set(SEARCH_KEY, arr)
    return arr
}

export function deleteSearchHistory (index) {     //删除某条数据，并返回删除后的新数组
    var arr = getSearchHistory()
    cutOutHistory(arr,index)
    storage.set(SEARCH_KEY, arr)
    return arr
}

export function clearSearchHistory (){            //清除后返回一个空数组
    storage.remove(SEARCH_KEY)
    return []                    
}



function cutOutHistory(arr,index){            //传入arr跟val及匹配index规则，删除对应val
    index > -1 ? arr.splice(index, 1) : ''
}

function insetHistory(arr, val , compare, lenMax){    //整个插入逻辑,（插入的）
    let index = arr.findIndex(compare) 
    if(index == 0){
        return
    }
    index > -1 ? arr.splice(index, 1) : ''
    arr.unshift(val)
    lenMax && arr.length > lenMax ? arr.pop() : ''
}
