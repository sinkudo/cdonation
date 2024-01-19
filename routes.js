const { response } = require('express');
const {resp} = require('./lib/utils')
const handlerequests = require('./handlerequests')
var JSONBig = require('json-bigint')
const cron = require('node-cron');
const { default: Web3 } = require('web3');
const {discordHTTP} = require('./axios')

module.exports = (app) => {
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
                // console.log(response.events)
                res.status(200).send({ ok: true })
                // res.status(200).send("SubscriptionTierCreated")
            })
            .catch(err => {
                // res.status(400).send(err.message)
                console.log(err.message)
                res.status(400).send({ ok: false })
            })
    })
    app.post('/createSub', (req, res) => {
        handlerequests.makePayment(req, res)
            .then(response => {
                console.log('kaif')
                handlerequests.createSub(req, res)
                    .then(response => {
                        console.log('success')
                        // console.log(response.events.SubscriptionCreated.returnValues)
                        let data = response.events.SubscriptionCreated.returnValues
                        let q = {
                            userId: data.userId.toString(),
                            roleId: data.roleId.toString()
                        }

                        res.status(200).send(q)
                    })
                    .catch(err => {
                        res.status(400).send(err)
                        console.log("error")
                    })
            })
            .catch(err => {
                console.log('pizda')
                console.log(err)
                res.status(200).send(err)
                // res.status(400).send(err.message)
            })
    })
    app.get('/getDiscordSubtiers/:id', (req, res) => {
        handlerequests.getAllTiersOfServer(req, res)
            .then(response => {
                // res.status(200).send(`${response}`)
                res.status(200).send(response)
            })
            .catch(err => {
                console.log('err', err)
                res.status(400).send(err)
            })
    })
    app.get('/getAddress/:id', (req, res) => {
        handlerequests.getUserAddress(req, res)
            .then(response => {
                res.status(200).send(response)
            })
            .catch(err => {
                res.status(400).send(err.message)
            })
    })
    app.post('/updateTier', (req, res) => {
        handlerequests.updateTier(req, res)
            .then(response => {
                console.log(response)
                res.status(200).send({ ok: true })
            })
            .catch(err => {
                console.log(err.message)
                res.status(400).send({ ok: false })
            })
    })


    const web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
    );
    

    app.get('/checkBalance/:address', async (req, res) => {
        // let q;
        // web3.eth.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").then((resp) => {
        //     console.log(resp)
        // })
        // let q = await web3.eth.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
        // console.log(q)
        handlerequests.checkBalance(req, res)
        .then(response => {
            res.status(200).send(response)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err.message)
        })
    })
    app.post('/cancelSubscription', async (req, res) => {
        handlerequests.cancelSub(req, res)
        .then(response => {
            res.status(200).send('subscription canceled')
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('error during subscription canceling')
        })
    })
    app.post('/qq', async (req, res) => {
        discordHTTP.post('/deleteRole', { user_id: req.body.user_id, role_id: req.body.role_id, server_id: req.body.server_id})
    })
}
