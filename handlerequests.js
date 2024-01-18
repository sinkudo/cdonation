// onst Web3 = require('web3')
const { Web3 } = require('web3')
const http = require('http');
const { ethers } = require('hardhat');
// const Plant = require("")
const toEther = (value) => Web3.utils.fromWei(String(value), 'ether');
const toWei = (value) => Web3.utils.toWei(String(value), 'ether');
const PORT = 8080
const HOST = 'localhost'
const { run, PAPA_ADDRESS, PAPA_PK } = require('./lib/utils.js')
const BigNum = Web3.utils.BN

let fs = require('fs');
const fspromises = fs.promises

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


var cors = require('cors');
const { connect } = require('http2');

function pause(millis) {
  var date = Date.now();
  var curDate = null;
  do {
    curDate = Date.now();
  } while (curDate - date < millis);
}
const { Users_contract, SubscriptionTiers_contract, Subscriptions_contract, TestContract_contract } = require('./getContracts.js')

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
exports.checkMyBalance = async (req, res) => {
  console.log(666)
  console.log(yarik_abi)
  const contract = await getContract(yarik_adr, yarik_abi);
  console.log(777)
  // const contract = await Users_contract
  return contract.methods.getMyBalance().call()
  // return Users_contract.methods.getMyBalance().call()
}
exports.sendTrans = async (req, res) => {
  return await web3.eth.sendTransaction({ to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', value: web3.utils.toWei('100000', 'ether') });
}
exports.createUser = async (req, res) => {
  // const contract1 = await getContract(users_adr, users_abi)
  const contract = await Users_contract()
  return await contract.methods.createUser(req.body.id, req.body.address).send({ from: PAPA_ADDRESS, gas: 3000000 })
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
  return await contract.methods.createSubscriptionTier(req.body.serverid, req.body.creatorid, req.body.name, req.body.description, req.body.price, req.body.roleid).send({ from: PAPA_ADDRESS, gas: 3000000 })
}

exports.createSub = async (req, res) => {
  // const contract = await getContract(sub_adr, sub_abi)
  const contract = await Subscriptions_contract()
  return await contract.methods.createSubscription(req.body.serverId, req.body.tierId, req.body.userId).send({ from: PAPA_ADDRESS, gas: 3_000_000 })
}
exports.getsuball = async (req, res) => {
  // return await contract.methods
}
exports.getAllTiersOfServer = async (req, res) => {
  const contract1 = await SubscriptionTiers_contract()
  // const contract2 = await Users_contract()
  // return await contract.methods.getAllSubscriptionTiersByDiscordId(req.params.id).call();
  let q = await contract1.methods.getAllSubscriptionTiersByDiscordId(req.params.id).call();
  // console.log(q[0]['0'])

  resp_arr = []
  console.log(q)
  q.forEach(element => {
    [...Array(6).keys()].forEach((i) => delete element[String(i)])
    delete element['__length__']
  });
  console.log(q)
  return q;
}