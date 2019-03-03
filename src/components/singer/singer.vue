<template>
    <div class="singer-wrap">
        <category :categoryData="singerTypeData"  @changeType="changeSingerType"></category>
        <address-list class="address-list" ref="address" :loadingStatus="loadingStatus" @selectTarget="selectSinger" :addressListData="singersData"></address-list>
    </div>
</template>

<script>
import category from 'base/category'
import getSingerData from "api/singer"
import {_singerTypeData} from "common/js/singerTypeData"
import getFirstLetter from 'common/js/getFirstLetter'
import { STATUS_TEXT } from "api/config"
import addressList from "base/addressList"


export default {
    name:'Singer',
    data(){
        return {
            singersData:[],
            loadingStatus:false,    //loading的显示状态
            oldType:-1
        }
    },
    activated(){
        this.$refs.address.refresh()
    },
    created(){
        this._getSingerData()
    },
    components:{
        category,
        addressList,
    },
    created(){
        this.singerTypeData = _singerTypeData
    },
    methods:{
        _getSingerData(e){
            var id = e.resourceType
            this.loadingStatus = true
            getSingerData(id).then(res => {
                if(res && res.statusText === STATUS_TEXT){
                    this.singersData = this.handleData(res.data.artists)
                    this.loadingStatus = false
                }
            })
        },
        changeSingerType(e){
            if(e.typeName != this.oldType){
                this._getSingerData(e)
                this.oldType = e.typeName;             //维护一个type，比较新旧type进行逻辑处理
            }
        },
        selectSinger(ops){
            this.$router.push({
                name:'songListPage',
                params:{
                    id:ops.id,
                    type:ops.type
                }
            })
        },
        handleData(arr){                                                           //处理数据格式
            var newArr = []
            var reg = /[A-z]/
            var other = {
                typeStr: '其他',
                detailArr:[]
            }
          
            arr.forEach( (item) => {
                item.firstStr = getFirstLetter(item.name.substr(0,1)).substr(0,1).toLocaleUpperCase()  //提取并往数据中加入-歌手名的第一个字符的首写字母的大写形式(toLocaleUpperCase方法是针对英文名开头小写)
                if(!reg.test(item.firstStr)){                                    //如果是非26个字母内的则单独处理并return
                    other.detailArr.push(item)
                    return
                }
                
                for(var i = 0 ; i < newArr.length; i++){ 
                    if(newArr[i].typeStr == item.firstStr){                        //查找是否有对应字母的对象，有则push数据后return，没有则创建后push数据；
                        newArr[i].detailArr.push(item)
                        return
                    }
                }
                newArr.push({
                    typeStr:item.firstStr,
                    detailArr : []
                })
                newArr[newArr.length-1].detailArr.push(item)
            })

            newArr.sort(function(a ,b){                                           //通过字母进行排序
                return a.typeStr.charCodeAt()-b.typeStr.charCodeAt()         
            })
            other.detailArr.length ? newArr.push(other) : ''                      //如果other的数组中存在值，则放到数组末尾，否则不用放
            return newArr
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"

    .singer-wrap
        position fixed
        top 94px
        bottom $miniPlayerHeight
        width 100%
        overflow hidden
        .address-list
            width 100%
            height 100%
            padding-bottom 40px
            box-sizing border-box
</style>
