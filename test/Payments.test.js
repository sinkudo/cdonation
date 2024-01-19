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
    paymentsContract = await Payments.deploy();
    await paymentsContract.deployTransaction.wait(); // Wait for the deployment transaction to be mined
  });

  it("should deposit funds", async function () {
    const value = ethers.utils.parseEther("2.0");

    // Deposit funds
    await paymentsContract.connect(user1).deposit({ value });

    // Get all payments
    const allPayments = await paymentsContract.getAllPayments();

    // Assert the deposit is logged
    expect(allPayments.length).to.equal(1);
    expect(allPayments[0].from).to.equal(user1.address);
    expect(allPayments[0].to).to.equal(paymentsContract.address);
    expect(allPayments[0].value).to.equal(value);
  });


  it("should withdraw all funds", async function () {
    const initialBalance = await ethers.provider.getBalance(owner.address);
    const depositValue = ethers.utils.parseEther("2.0");

    // Deposit funds
    await paymentsContract.connect(user1).deposit({ value: depositValue });

    // Withdraw all funds
    await paymentsContract.connect(owner).withdrawAll();

    // Assert the withdrawal is logged
    const allPayments = await paymentsContract.getAllPayments();
    expect(allPayments.length).to.equal(2); // One for deposit and one for withdrawal

    // Assert the balance of the owner after withdrawal
    const finalBalance = await ethers.provider.getBalance(owner.address);
    expect(finalBalance.sub(initialBalance)).to.equal(depositValue);
  });
});
