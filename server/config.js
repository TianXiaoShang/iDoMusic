var fs = require('fs')

var conf = fs.readFileSync('./server.conf')

var configArr = conf.toString().split('\n')

var globalConfig = {}

for(var i = 0; i < configArr.length; i ++) {
  globalConfig[configArr[i].split('=')[0]] = configArr[i].split('=')[1].trim()
}

module.exports = globalConfig