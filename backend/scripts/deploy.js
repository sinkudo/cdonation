
const hre = require("hardhat");
const { ethers } = require("hardhat")
const fs = require('fs')

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  // const yarik = await hre.ethers.deployContract("Yarik")
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // const Yarik = await ethers.getContractFactory("Yarik");
  // const yarik = await Yarik.deploy();
  // await yarik.waitForDeployment();

  const Users = await ethers.getContractFactory("Users");
  const users = await Users.deploy();
  await users.waitForDeployment();

  const Subtiers = await ethers.getContractFactory("SubscriptionTiers");
  const subtiers = await Subtiers.deploy();
  await subtiers.waitForDeployment();

  const Subcriptions = await ethers.getContractFactory("Subscriptions");
  const subcriptions = await Subcriptions.deploy(await subtiers.getAddress());
  await subcriptions.waitForDeployment();

  const TestContract = await ethers.getContractFactory('TestContract')
  const testcontract = await TestContract.deploy()
  await testcontract.waitForDeployment()

  const Payments = await ethers.getContractFactory('Payments')
  const payments = await Payments.deploy()
  await payments.waitForDeployment()

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
  const adrs = {
    Users: await users.getAddress(),
    SubscriptionTiers: await subtiers.getAddress(),
    Subscriptions: await subcriptions.getAddress(),
    TestContract: await testcontract.getAddress(),
    Payments: await payments.getAddress()
  }
  const data = JSON.stringify(adrs)
  fs.writeFile("addresses.json", data, (error) => {
    if (error) {
      console.log(error)
      throw error
    }
    console.log("addreses written")
  })

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
