const { response } = require('express');
var handlerequests = require('./handlerequests')
var JSONBig = require('json-bigint')

module.exports = (app) => {
    app.get('/checkMyBalance', (req, res) => {
        console.log('123')
        handlerequests.checkMyBalance(req, res)
        .then(response => {
            console.log("Balance is %d", response)
            let new_resp = `Balance is ${response}`
            res.status(200).send(new_resp)
        })
        .catch(err => {
            res.status(400).send(err)
        })
    });
    app.post('/sendTransaction', (req, res) => {
        handlerequests.sendTrans(req, res)
        .then(response => {
            res.status(200).send(response)
        })
        .catch(err => {
            res.status(400).send(err)
        })
    })
    app.post('/createUser', (req, res) => {
        // console.log(req)
        handlerequests.createUser(req, res)
        .then(response => {
            console.log("user created")
            res.status(200).send("success")
        })
        .catch(err => {
            res.status(400).send(err)
        })
    })
    app.post('/createSubtiers', (req, res) => {
        handlerequests.createSubtiers(req, res)
        .then(response => {
            console.log('subtiers created')
            // console.log(JSONBig.parse(response.events))
            // console.log(response.events)
            res.status(200).send(response.events)
            // res.status(200).send("SubscriptionTierCreated")
        })
        .catch(err => {
            res.status(400).send(err.message)
        })
    })
    app.post('/createSub', (req, res) => {
        handlerequests.createSub(req, res)
        .then(response => {
            console.log(response)
            res.status(200).send(response)
        })
        .catch(err => {
            // res.status(400).send(err.innerError.message)
            res.status(400).send(err)
        })
    })
    app.get('/getDiscordSubtiers/:id', (req, res) => {
        handlerequests.getAllTiersOfServer(req, res)
        .then(response => {
            res.status(200).send(`${response}`)
        })
        .catch(err => {
            console.log('err', err)
            res.status(400).send(err)
        })
    })
    app.get('/getAddress/:id', (req, res) => {
        handlerequests.getUserAddress(req, res)
        // handlerequests.getAllTiersOfServer(req, res)
        .then(response => {
            res.status(200).send(`${response}`)
        })
        .catch(err => {
            res.status(400).send(err.message)
        })
    })
    // app.get('/getsuball'), 
}