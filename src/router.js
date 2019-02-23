import Vue from "vue"
import Router from "vue-router"
Vue.use(Router)

import Recommend from "components/recommend/recommend"
import Songs from "components/songs/songs"
import Rank from "components/rank/rank"
import Singer from "components/singer/singer"
import MusicList from 'base/MusicList'

export default new Router({
    routes:[
        {
            path:'/',
            redirect:'/recommend'
        },
        {
            path:'/recommend',
            component:Recommend
        },
        {
            path:"/songs",
            component:Songs,
            // beforeEnter: (to, from ,next) => {
            //     // console.log(1111)
            //     next()
            // }
        },
        {
            path:'/rank',
            component:Rank
        },
        {
            path:'/singer',
            component: Singer
        },
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