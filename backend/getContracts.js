// // import { users_adr, users_abi, yarik_abi, yarik_adr } from './getJsonData.js';
const fs = require('fs')
const { Web3 } = require('web3')

const web3 = new Web3(
    new Web3.providers.HttpProvider('http://localhost:8545')
  );
// const { run } = require('./lib/utils.js')
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

// // export let users_contract = getContract(users_adr, users_abi)
// // export let yarik_contract = getContract(yarik_adr, yarik_abi)
// // const user_contract = await getContract(users_adr, users_abi);
// // const yarik_contract = await getContract(yarik_adr, yarik_abi);
// // let users_contract
// // let yarik_contract
// // async function main(){
// //     users_contract = await getContract(users_adr, users_abi);
// //     yarik_contract = await getContract(yarik_adr, yarik_abi);
// // }
// // run(main)
// // export { users_contract, yarik_contract }
// module.exports.users_contract = async()

function getAddresses() {
    const data = JSON.parse(fs.readFileSync('./addresses.json', 'utf8'))
    return data
}
let addresses = getAddresses()
function getAddress(contractname){
    return addresses[contractname]
}
function getAbi(contractName) {
    // console.log(`./artifacts/contracts/${contractName}.sol/${contractName}.json`, 'utf8')
    const data = JSON.parse(fs.readFileSync(`./artifacts/contracts/${contractName}.sol/${contractName}.json`, 'utf8'))
    const abi = data['abi']
    return abi
}
async function getContract(contractName) {
    abi = getAbi(contractName)
    adr = getAddress(contractName)
    const coinbase = await web3.eth.getCoinbase();
    const contract = new web3.eth.Contract(abi, adr, {
      // Set default from address
      from: coinbase,
      // Set default gas amount
      gas: 5000000,
    });
    // console.log(abi)
    return contract
}
exports.Users_contract = async () => {
    return await getContract("Users")
}
exports.Subscriptions_contract = async () => {
    return await getContract("Subscriptions")
}
exports.SubscriptionTiers_contract = async () => {
    return await getContract("SubscriptionTiers")
}
exports.TestContract_contract = async () => {
    return await getContract("TestContract")
}
exports.Payments_contract = async() => {
    return await getContract("Payments")
}