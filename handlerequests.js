// onst Web3 = require('web3')
const {Web3} = require('web3')
const http = require('http');
const { ethers } = require('hardhat');
// const Plant = require("")
const toEther = (value) => Web3.utils.fromWei(String(value), 'ether');
const toWei = (value) => Web3.utils.toWei(String(value), 'ether');
const PORT = 8080
const HOST = 'localhost'
const {run} = require('./lib/utils.js')
const BigNum = Web3.utils.BN

let fs = require('fs');
const fspromises = fs.promises

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


var cors = require('cors')

function pause(millis) {
  var date = Date.now();
  var curDate = null;
  do {
      curDate = Date.now();
  } while (curDate-date < millis);
}
// console.log(1)
// async function main(){
//     const adr = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707"
//     // const contract = require('./artifacts/contracts/Yarik.sol/Yarik.json')
//     let abi = await getAbi()
//     let provider = ethers.getDefaultProvider("https://mainnet.infura.io/v3/483741c81c274efcbb43bfdb991e4211")
//     // let signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f", provider)
//     const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

//     // let contract = new ethers.Contract("0x3aa5ebb10dc797cac828524e59a333d0a371443c", abi, "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") 
//     // console.log(await ethers.getSigners(0))
//     // let contract = new ethers.Contract(adr, abi, await ethers.getSigners(0)) 

//     // let contract = new ethers.Contract(adr, abi, signer) 
//     const web3 = new Web3(
//       new Web3.providers.HttpProvider('http://localhost:8545')
//     );
//     const coinbase = await web3.eth.getCoinbase();
//     // console.log(getAbi())
//     const contract = new web3.eth.Contract(await getAbi(), adr, {
//       // Set default from address
//       from: coinbase,
//       // Set default gas amount
//       gas: 5000000,
//     });
//     // pause(1000)

//     console.log(await contract.methods.greet().call())

//     app.get('/greet', async ({req, res}) => {
//       console.log('123')
//     })

//     // const Yarik = await ethers.getContractAt("Yarik", "0x3aa5ebb10dc797cac828524e59a333d0a371443c")
//     // console.log(await Yarik.getAddress())
//     // let value = await Yarik.func()
//     // console.log(await contract.getMyBalance())
//     // const contract = Yarik.attach("0x5fc8d32690cc91d4c39d9d3abcbd16989f875707")

//     // const greeting = await contract.greet()
//     // console.log()
    
//     // console.log(await contract.getAddress())
//     // console.log(await contract.)

//     // const web3 = new Web3(new Web3.providers.HttpProvide('http://localhost:8545'))

//     // const yarik = new web3.eth.Contract(contract.interface)
// }
// run(main)
let contr = 'Yarik'
async function getAbi(){
  const data = await fspromises.readFile(`./artifacts/contracts/${contr}.sol/${contr}.json`)
  const abi = JSON.parse(data)['abi'];
  return abi
}

const contract_adr = "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853"
const web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);
// console.log(getAbi())

async function getContract(){
  const coinbase = await web3.eth.getCoinbase();
  const contract = new web3.eth.Contract(await getAbi(), contract_adr, {
    // Set default from address
    from: coinbase,
    // Set default gas amount
    gas: 5000000,
  });
  return contract
} 
  
exports.GreetFunc = async (req, res) => {
  const contract = await getContract();
  let l = await contract.methods.getMyBalance().call()
  // console.log(await contract.methods.greet().call())
  console.log(l)
} 
  
exports.SendTrans = async(req, res) => {
  await web3.eth.sendTransaction({to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', value: web3.utils.toWei('100000', 'ether')});
}