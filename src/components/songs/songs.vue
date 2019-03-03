<template>
    <div class="songs-wrap">
        <category :categoryData="categoryData" @changeType="changeType"></category>
        <my-scroll :data="songListData" class="scroll-wrap" ref='scrollWrap'>
            <songList 
            :songListData="songListData" 
            :scrollToTop="oldType" 
            :loadingStatus="loadingStatus"
            :column="column"
            ></songList>
            <loading v-if="loadingStatus"></loading>
        </my-scroll>
    </div>
</template>

<script>
import Category from 'base/category'
import songList from 'base/songList'
import myScroll from "base/myScroll"
import loading from 'base/loading'
import { STATUS_TEXT } from "api/config"
import { getSongsData,getCategoryData } from "api/songs"
import {_creatGridData} from "common/js/creatListData"
    
export default {
    name:'Songs',
    data(){
        return {
            categoryData: {},
            oldType:'',
            songListData:[],
            loadingStatus:false,
            column:2,
        }
    },
    watch:{
        oldType(){
            this.changeScrollTo()
        }
    },
    components:{
        Category,
        songList,
        myScroll,
        loading
    },
    mounted(){
        this._getCategoryData();   //获取歌单类型title数据
    },
    methods:{
        _getCategoryData(){
            getCategoryData().then(res => {
                if(res && res.statusText === STATUS_TEXT){
                var data = res.data
                this.categoryData.fathers = this.filterData(data)
                this.categoryData.children = data.sub
                this.categoryData = Object.assign({},this.categoryData)  //通过对象合并改变对象地址以使得数据能够正常更新
                }
            })
        },
        _creatSongList(res){
            if(res && res.statusText === STATUS_TEXT){
                this.songListData = this.creatData(res.data.playlists)
                this.loadingStatus = false
            }else{
                console.log('歌单列表获取失败')
            }
        },
        filterData(data){       //设置成一个数组中两个对象，以渲染二级菜单
            //处理数据，手动加入“全部歌单”
            var newCategories = [];
            var all = {fatherNum:'-1',fatherName:data.all.name};
            newCategories.push(all);
            //循环处理分类数据为一个数组方便使用
            var categories = data.categories;
            for(var key in categories){
                newCategories.push({fatherNum:key,fatherName:categories[key]})
            }
            return newCategories
        },
        changeType(e){
            if(e.typeName != this.oldType){
                this.loadingStatus = true
                getSongsData(e.typeName).then(res => this._creatSongList(res))   //获取对应type的歌单
                this.oldType = e.typeName;             //维护一个type，比较新旧type进行逻辑处理
            }
        },

        creatData(data){
            var newData = []
            data.forEach((item, index) => {
                newData.push(new _creatGridData(item.coverImgUrl, item.playCount, item.creator.nickname, item.name, item.id, true,true,true,'mix'))
            })
            return newData;
        },
        changeScrollTo(){      //切换类型后滚动到顶端
            this.$refs.scrollWrap.scrollTo(0,0,200)
        },
    },
    activated(){
        this.$refs.scrollWrap.refresh()
    },

}
</script>

<style lang="stylus" scoped>
@import "~common/styles/variable"

        .songs-wrap
            position fixed
            top 94px
            bottom $miniPlayerHeight
            width 100%
            .scroll-wrap
                position absolute
                top 40px
                bottom 0px
                width 100%
                background-image url('../../assets/BgImage1.png')
                background-size cover
                overflow hidden

</style>

