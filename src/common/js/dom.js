export default function addClass(dom, className){
    if(hasName(dom, className)){
        return
    }
    let classNameArr = dom.className.split(' ')
    classNameArr.push('slider-item')
    if(classNameArr[0] == ''){    //没有calssName的情况会匹配出一个空串' '
        classNameArr.shift()
    }
    dom.className = classNameArr.join(' ')
}

function hasName(dom, className){
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(dom.className)
}