var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("files"));
app.listen(3000)
// var handlerequests = require('./handlerequests')
// app.get('/checkMyBalance', ({req, res}) => {
//     handlerequests.checkMyBalance(req, res)
//     .then(response => {
//         console.log("Balance is %d", response)
//         let new_resp = `Balance is ${response}`
//         res.status(200).send(new_resp)
//     })
//     .catch(err => {
//         res.status(400).send(err)
//     })
// });

// app.get('/sendTransaction', ({req, res}) => {
//     handlerequests.sendTrans(req, res)
//     .then(response => {
//         res.status(200).send(response)
//     })
//     .catch(err => {
//         res.status(400).send(err.message)
//     })
// })

var routes = require('./routes')
routes(app)