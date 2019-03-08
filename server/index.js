var express = require('express')
var proxy = require('http-proxy-middleware')
var globalConfig = require('./config')

var app = new express()

app.use('/', express.static(globalConfig.page_path,{maxAge:'1m'}))
app.use('/api', proxy({
  target: 'http://localhost:3000',
  pathRewrite: {'/api': ''}
}))

app.listen(globalConfig.port, function () {
  console.log('服务器，启动！' + globalConfig.port)
})
