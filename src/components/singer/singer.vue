<template>
    <div class="singer-wrap">
        <category :categoryData="singerTypeData" @changeType="changeSingerType"></category>
    </div>
</template>

<script>
import category from 'base/category'
import getSingerData from "api/singer"
import {_singerTypeData} from "common/js/singerTypeData"
import getFirstLetter from 'common/js/getFirstLetter'
import { STATUS_TEXT } from "api/config"

export default {
    name:'Singer',
    data(){
        return {
            singersData:[]
        }
    },
    created(){
        this._getSingerData()
    },
    components:{
        category
    },
    created(){
        this.singerTypeData = _singerTypeData
    },
    methods:{
        _getSingerData(e){
            var id = e.resourceType
            getSingerData(id).then(res => {
                if(res && res.statusText === STATUS_TEXT){
                    this.singersData = this.handleData(res.data.artists)
                }
            })
        },
        changeSingerType(e){
            this._getSingerData(e)
        },
        handleData(arr){                                                           //处理数据格式
            var newArr = []
            arr.forEach( (item) => {
                item.firstStr = getFirstLetter(item.name.substr(0,1)).substr(0,1)  //提取并往数据中加入-歌手名的第一个字符的首写字母的大写形式
                for(var i = 0 ; i < newArr.length; i++){ 
                    if(newArr[i].typeStr == item.firstStr){                        //查找是否有对应字母的对象，有则push数据，没有则创建后push数据；
                        newArr[i].singerArr.push(item)
                        return
                    }
                }
                newArr.push({
                    typeStr:item.firstStr,
                    singerArr : []
                })
                newArr[newArr.length-1].singerArr.push(item)
            })
            newArr.sort(function(a ,b){                                           //通过字母进行排序
                return a.typeStr.charCodeAt()-b.typeStr.charCodeAt()         
            })
            return newArr
        }
    }
}
</script>

<style lang="stylus" scoped>
</style>
