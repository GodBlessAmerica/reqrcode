var express = require('express');
var https = require('https');
var fs = require('fs');

//同步读取密钥和签名证书
var options = {
    key:fs.readFileSync('./keys/server.key'),
    cert:fs.readFileSync('./keys/server.crt')
}

var app = express();
app.use(express.static('./'))

var httpsServer = https.createServer(options,app);

//https监听3003端口
httpsServer.listen(3003);