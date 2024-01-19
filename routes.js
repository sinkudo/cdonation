const { response } = require('express');
var handlerequests = require('./handlerequests')
var JSONBig = require('json-bigint')
const cron = require('node-cron')
module.exports = (app) => {

    // cron.schedule('* * * * *', () => {
    //     console.log('nice')
    // })

    // app.get('/checkMyBalance', (req, res) => {
    //     console.log('123')
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
        // handlerequests.createSub(req, res)
        // .then(response => {
        //     console.log('success')
        //     // console.log(response.events.SubscriptionCreated.returnValues)
        //     let data = response.events.SubscriptionCreated.returnValues
        //     console.log(data.userId, data.roleId)
        //     // res.status(200).send(data.userId)
        //     let q = {
        //         userId: data.userId.toString(),
        //         roleId: data.roleId.toString()
        //     }
        //     res.status(200).send( q )
        // })
        // .catch(err => {
        //     // res.status(400).send(err.innerError.message)
        //     res.status(400).send(err)
        // })
        // handlerequests.makePayment(req, res)
        // .then(response => {
        //     // console.log('payment success')
        //     // res.status(200).send("payment success")
        //     console.log('kaif')
        // })
        // .catch(err => {
        //     console.log('pizda')
        //     console.log(err)
        //     // res.status(400).send(err.message)
        // })
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
    app.get('/', (req, res) => {
        handlerequests.mm(req, res)
        .then(response => {
            res.status(200).send(response)
        })
    })
}