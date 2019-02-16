<template>
    <div class="songs-wrap">
        <category :categoryData="categoryData" @changeType="changeType"></category>
        <songList :songListData="songListData" :scrollToTop="oldType" :loadingStatus="loadingStatus"></songList>
    </div>
</template>

<script>
import Category from 'base/category'
import songList from 'base/songList'
import { STATUS_TEXT } from "api/config"
import { getSongsData,getCategoryData } from "api/songs"
    

export default {
    name:'Songs',
    data(){
        return {
            categoryData: {},
            oldType:'',
            songListData:null,
            loadingStatus:false
        }
    },
    components:{
        Category,
        songList
    },
    mounted(){
        this._getCategoryData();   //获取歌单类型title数据
    },
    methods:{
        _getCategoryData(){
            getCategoryData().then(res => {
                if(res && res.statusText === STATUS_TEXT){
                var data = res.data
                this.categoryData.categorys = this.filterData(data)
                this.categoryData.types = data.sub
                this.categoryData = Object.assign({},this.categoryData)  //通过对象合并改变对象地址以使得数据能够正常更新·
                }
            })
        },
        filterData(data){       //设置成一个数组中两个对象，以渲染二级菜单
            //处理数据，手动加入“全部歌单”
            var newCategories = [];
            var all = {typeNum:'-1',typeName:data.all.name};
            newCategories.push(all);
            //循环处理分类数据为一个数组方便使用
            var categories = data.categories;
            for(var key in categories){
                newCategories.push({typeNum:key,typeName:categories[key]})
            }
            return newCategories
        },
        changeType(e){
            if(e.type != this.oldType){
                if(e.type == undefined){           //默认获取全部歌单
                    this.loadingStatus = true
                    getSongsData().then(res => this._creatSongList(res))
                }else{                             //获取对应type的歌单
                    this.loadingStatus = true
                    getSongsData(e.type).then(res => this._creatSongList(res))
                }
                this.oldType = e.type;             //维护一个type，比较新旧type进行逻辑处理
            }
        },
        _creatSongList(res){
            console.log(res)
            setTimeout(() => {
                if(res && res.statusText === STATUS_TEXT){
                    this.songListData = res.data.playlists
                    this.loadingStatus = false
                }else{
                    console.log('歌单列表获取失败')
                }
            },200)

        }
    }

}
</script>

<style lang="stylus" scoped>

</style>

