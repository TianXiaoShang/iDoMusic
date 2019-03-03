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

export function getData(el,type,val){
    const prefix = 'data-'
    if (val) {
      return el.setAttribute(prefix + type, val)
    }
    return el.getAttribute(prefix + type)           //获取到的这个值是一个字符串，！！！！一定要做类型转换处理
}