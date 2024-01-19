// Payments.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments Contract", function () {
  let paymentsContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Payments = await ethers.getContractFactory("Payments");
    paymentsContract = await Payments.connect(owner).deploy();
    await paymentsContract.waitForDeployment();
  });

  it("should be deployed", async function() {
    expect(await paymentsContract.getAddress()).to.be.properAddress
  })

  it("should have 0 ether by default", async function() {
    const balance = await paymentsContract.currentBalance();
    expect(balance).to.eq(0);
  });


  it("should log payments", async function () {
    const value = ethers.parseEther("1.0");
    
    await paymentsContract.connect(user1).makePayment(owner.address, { value });

    const allPayments = await paymentsContract.getAllPayments();

    expect(allPayments.length).to.equal(1);
    expect(allPayments[0].from).to.equal(user1.address);
    expect(allPayments[0].to).to.equal(owner.address);
    expect(allPayments[0].value).to.equal(value);
  });

  it("should deposit funds", async function () {
    const value = ethers.parseEther("2.0");

    await paymentsContract.connect(user1).deposit({ value });

    const allPayments = await paymentsContract.getAllPayments();

    expect(allPayments.length).to.equal(1);
    expect(allPayments[0].from).to.equal(user1.address);
    const myContractDeployedAddress = await paymentsContract.getAddress();
    expect(allPayments[0].to).to.equal(myContractDeployedAddress);
    expect(allPayments[0].value).to.equal(value);
  });

  it("should withdraw funds", async function () {
    const initialBalance = await ethers.provider.getBalance(owner.address);
    const value = ethers.parseEther("1.0");

    await paymentsContract.connect(user1).deposit({ value });

    await paymentsContract.connect(owner).withdraw(user2.address, value);

    const allPayments = await paymentsContract.getAllPayments();
    expect(allPayments.length).to.equal(2);
  });

  it("should withdraw all funds", async function () {
    const initialBalance = await ethers.provider.getBalance(owner.address);
    const depositValue = ethers.parseEther("2.0");

    await paymentsContract.connect(user1).deposit({ value: depositValue });

    await paymentsContract.connect(owner).withdrawAll();

    const allPayments = await paymentsContract.getAllPayments();
    expect(allPayments.length).to.equal(2);

    const finalBalance = await ethers.provider.getBalance(owner.address);
    const myContractDeployedAddress = await paymentsContract.getAddress();
    const contractBalance = await ethers.provider.getBalance(myContractDeployedAddress);
    expect(contractBalance).to.equal(0);
  });
});