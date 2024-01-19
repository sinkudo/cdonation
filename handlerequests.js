// onst Web3 = require('web3')
const { Web3 } = require('web3')
const http = require('http');
const { ethers } = require('hardhat');
// const Plant = require("")
const toEther = (value) => Web3.utils.fromWei(String(value), 'ether');
const toWei = (value) => Web3.utils.toWei(String(value), 'ether');
var cron = require('node-cron')
const { run } = require('./lib/utils.js')

const BigNum = Web3.utils.BN

let fs = require('fs');
const fspromises = fs.promises

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


var cors = require('cors');

function pause(millis) {
  var date = Date.now();
  var curDate = null;
  do {
    curDate = Date.now();
  } while (curDate - date < millis);
}
const { Users_contract, SubscriptionTiers_contract, Subscriptions_contract, TestContract_contract, Payments_contract } = require('./getContracts.js');
const { discordHTTP } = require('./axios.js');

function getAddresses() {
  const data = JSON.parse(fs.readFileSync('./addresses.json', 'utf8'))
  return data
}
function getAbi(contractName) {
  const data = JSON.parse(fs.readFileSync(`./artifacts/contracts/${contractName}.sol/${contractName}.json`, 'utf8'))
  const abi = data['abi']
  return abi
}

adrs = getAddresses()
users_abi = getAbi("Users")
sub_abi = getAbi("Subscriptions")
subtier_abi = getAbi("SubscriptionTiers")
users_adr = getAddresses()['Users']
sub_adr = getAddresses()['Subscriptions']
subtiers_adr = getAddresses()['SubscriptionTiers']

const web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);



async function getContract(address, abi) {
  const coinbase = await web3.eth.getCoinbase();
  const contract = new web3.eth.Contract(abi, address, {
    // Set default from address
    from: coinbase,
    // Set default gas amount
    gas: 5000000,
  });
  return contract
}
exports.sendTrans = async (req, res) => {
  // return await web3.eth.sendTransaction({ to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', value: web3.utils.toWei('100000', 'ether') });
  return await web3.eth.sendTransaction({ to: process.env.PAPA_ADDRESS, from: req.body.buyer, value: web3.utils.toWei(req.body.weis, 'ether') });
}
exports.createUser = async (req, res) => {
  // const contract1 = await getContract(users_adr, users_abi)
  const contract = await Users_contract()
  return await contract.methods.createUser(req.body.id, req.body.address).send({ from: process.env.PAPA_ADDRESS, gas: 3000000 })
}

exports.getUserAddress = async (req, res) => {
  // const contract = await getContract(users_adr, users_abi)
  const contract = await Users_contract()
  console.log(contract.methods)
  return await contract.methods.getAddress(req.params.id).call();
  // let b = await contract.methods.getAddress(req.params.id).call((err, res) => {
  //   console.log(err)
  // })
  // return b
}
exports.createSubtiers = async (req, res) => {
  // const contract = await getContract(subtiers_adr, subtier_abi)
  const contract = await SubscriptionTiers_contract()
  // console.log(contract.getAddress())
  return await contract.methods.createSubscriptionTier(req.body.serverId, req.body.creatorId, req.body.name, req.body.description, req.body.price, req.body.roleId).send({ from: process.env.PAPA_ADDRESS, gas: 3000000 })
}
exports.getsuball = async (req, res) => {
  // return await contract.methods
}
exports.getAllTiersOfServer = async (req, res) => {
  const contract1 = await SubscriptionTiers_contract()
  let q = await contract1.methods.getAllSubscriptionTiersByDiscordId(req.params.id).call();

  resp_arr = []
  q.forEach(element => {
    [...Array(6).keys()].forEach((i) => delete element[String(i)])
    // element.forEach((values, keys) => {
    //   element[keys] = String(values)
    // })
    for (let key in element) {
      if (element.hasOwnProperty(key) && typeof element[key] === 'bigint') {
        element[key] = Number(element[key])
      }
    }

    delete element['__length__']
  });
  return q;
}
exports.updateTier = async (req, res) => {
  const contract = await SubscriptionTiers_contract()
  const body = req.body
  let response = await contract.methods.updateTier(body.serverId, body.tierId, body.name, body.description, body.price).send({ from: process.env.PAPA_ADDRESS, gas: 3_000_000 })
  return response
}
exports.createSub = async (req, res) => {
  const contract = await Subscriptions_contract()
  const contract2 = await Users_contract()
  let userAddress = await contract2.methods.getAddress(req.body.userId).call();
  return await contract.methods.createSubscription(req.body.serverId, req.body.tierId, req.body.userId).send({ from: userAddress, gas: 3_000_000 })
}
exports.makePayment = async (req, res) => {
  const body = req.body
  let tiers = await SubscriptionTiers_contract()
  let users = await Users_contract()
  let payment = await Payments_contract()
  let creatorid = await tiers.methods.getCreatorIdByTierId(body.serverId, body.tierId).call()
  let userAddress = await users.methods.getAddress(body.userId).call();
  let creatorAddress = await users.methods.getAddress(creatorId).call();
  let price = await tiers.methods.getPriceByTierId(body.serverId, body.tierId).call()
  let response = await payment.methods.makePayment(creatorAddress).send({ from: userAddress, gas: 3_000_000, value: price })
  return response
}

exports.renew_subscriptions = async (req, res) => {
  const subs = await Subscriptions_contract()
  const users = await Users_contract()
  const payment = await Payments_contract()
  const tiers = await SubscriptionTiers_contract()
  let subscriptions = await subs.methods.listSubs().call()
  console.log(subscriptions)
  if (subscriptions.length === 0)
    return;
  subscriptions.forEach(async element => {
    if (element['endTimestamp'] > Date.now() / 1000)
      return
    const user_id = element['userId']
    const user_address = await users.methods.getAddress(user_id).call()
    const creator_id = await tiers.methods.getCreatorIdByTierId(element['serverId'], element['subscriptionTierId']).call()
    const creator_address = await users.methods.getAddress(creator_id).call()
    const user_balance = await web3.eth.getBalance(user_address)
    const renewal_status = await subs.methods.getRenewalStatus(element['id']).call()
    if (user_balance < element['price'] || !renewal_status) {
      const role_id = await tiers.methods.getRoleIdByTierId(element['serverId'], element['subscriptionTierId']).call()
      discordHTTP.post('/deleteRole', { user_id: user_id, role_id: role_id, server_id: element['serverId']})
    }
    payment.methods.makePayment(creator_address).send({ from: user_address, gas: 3_000_000, value: element['price'] }).then(() => {
      subs.methods.renewSubscription(element['id']).send({ from: process.env.PAPA_ADDRESS, gas: 3_000_000 })
    })
    console.log("renew sub")
  });
}

exports.checkBalance = async (req, res) => {
  const balance = await web3.eth.getBalance(req.params.address);
  return web3.utils.fromWei(balance, "ether")
}

exports.cancelSub = async (req, res) => {
  const Subcription = await Subscriptions_contract()
  return Subcription.methods.cancelSubscription(req.body.serverId, req.body.userId)
}

async function cronim() {
  const subs = await Subscriptions_contract()
  console.log(subs.methods)
}

cron.schedule('0 0 * * *', async () => {
  this.renew_subscriptions()
})
