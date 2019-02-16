module.exports = {
    configureWebpack: {
        resolve: {
            alias: {             //路径名替换，@已经内置配置好为src
                'components': '@/components',
                'assets': '@/assets',
                'common': '@/common',
                'api': '@/api',
                'base': '@/base'
            }
        },
    },
    // baseUrl:'/',
    devServer: {
        open: true,    //自动打开浏览器页面
        port: 8081,    //端口
        proxy: {
            '/api': {
                target: ' http://localhost:3000',
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
    },

}