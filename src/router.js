import Vue from "vue"
import Router from "vue-router"
Vue.use(Router)

import Recommend from "components/recommend/recommend"
import Songs from "components/songs/songs"
import Rank from "components/rank/rank"
import Singer from "components/singer/singer"
import MusicList from 'base/MusicList'
import SongListPage from 'components/songListPage/songListPage'

export default new Router({
    routes:[
        {
            path:'/',
            redirect:'/recommend'
        },
        {
            path:'/recommend',
            meta:{index:0},
            component:Recommend
        },
        {
            path:"/songs",
            meta:{index:1},
            component:Songs,
            // beforeEnter: (to, from ,next) => {
            //     // console.log(1111)
            //     next()
            // }
        },
        {
            path:'/rank',
            meta:{index:2},
            component:Rank
        },
        {
            path:'/singer',
            meta:{index:3},
            component: Singer
        },
        {
            path:'/songListPage',
            meta:{index:4},
            name:'songListPage',
            component: SongListPage
        },
        // {
        //     path:'/player',
        //     meta:{index:5},
        //     name:'player',
        //     components: {player:player}
        // }





        // {
        //     path:'/searchType',
        //     components:{
        //         search:MusicList
        //     },
        //     children:[
        //         {
        //             path:'/searchtypesSong',
        //             component:MusicList
        //         },
        //         {
        //             path:'/searchtypesSinger',
        //             component:MusicList
        //         },
        //         {
        //             path:'/searchtypesMix',
        //             component:MusicList
        //         },
        //     ]
        // }
    ]
})