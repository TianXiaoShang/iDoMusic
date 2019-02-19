import Vue from "vue"
import Router from "vue-router"
Vue.use(Router)

import Recommend from "components/recommend/recommend"
import Songs from "components/songs/songs"
import Rank from "components/rank/rank"
import Singer from "components/singer/singer"

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
            component:Songs
        },
        {
            path:'/rank',
            component:Rank
        },
        {
            path:'/singer',
            component: Singer
        }
    ]
})