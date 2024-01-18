var express = require('express');
var app = express();
app.listen(3000)
var handlerequests = require('./handlerequests')
app.get('/greet', ({req, res}) => {
    handlerequests.GreetFunc(req, res)
    // console.log(123)
});

app.get('/transaction', ({req, res}) => {
    handlerequests.SendTrans(req, res)
})