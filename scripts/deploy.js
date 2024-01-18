
const hre = require("hardhat");
const { ethers } = require("hardhat")

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

  const Yarik = await ethers.getContractFactory("Yarik");
  const yarik = await Yarik.deploy();
  await yarik.waitForDeployment();


  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello");
  await greeter.waitForDeployment();
  console.log("greet", await greeter.greet())

  console.log("Contract address:", await yarik.getAddress());
  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
