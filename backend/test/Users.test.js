// Users.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Users Contract", function () {
  let usersContract;
  let owner;
  let user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const Users = await ethers.getContractFactory("Users");
    usersContract = await Users.connect(owner).deploy();
    await usersContract.waitForDeployment();
  });

  it("should be deployed", async function() {
    expect(await usersContract.getAddress()).to.be.properAddress
  });

  it("should create a user", async function () {
    const discordId = 123;
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    await usersContract.createUser(discordId, userAddress);

    const createdAddress = await usersContract.getAddressTest(discordId);

    expect(createdAddress).to.equal(userAddress);
  });
});
