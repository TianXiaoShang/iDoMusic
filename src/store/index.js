import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'//vuex的dist目录下有一个logger，通过这个可以再控制台记录state修改的日志


Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'//判断是否是在开发环境
export default new Vuex.Store({
    getters,
    actions,
    state,
    mutations,
    // strict: debug,//如果是在开发环境，debug为true，也就开启了严格模式，它会检测你state的修改是否来自于mutations，如果不是，会报一个警告
    plugins:  [createLogger()] //插件,日志
})



