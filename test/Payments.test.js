const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Payments", function () {
  let acc1
  let acc2
  let payments
  let paymentsaddress

  beforeEach(async function() {
    [acc1, acc2] = await ethers.getSigners()
    console.log("сигнеры")
    console.log(acc1, acc2)
    const Payments = await ethers.getContractFactory("Payments", acc1)
    payments = await Payments.deploy()
    await payments.waitForDeployment()
    // paymentsaddress = await payments.getAddress()
    // console.log("пэймент", payments)
    // console.log("address", await payments.getAddress())
    // await payments.deployed()
  })

  it("should be deployed", async function() {
    console.log("depl", await payments.getAddress())
    expect(await payments.getAddress()).to.be.properAddress
  })

  it("should have 0 ether by default", async function() {
    const balance = await payments.currentBalance()
    expect(balance).to.eq(0)
  })

  it("should be possible to send funds", async function() {
    const sum = 100
    const msg = "hello from hardhat"
    const tx = await payments.connect(acc2).pay(msg, { value: sum })

    await expect(() => tx)
      .to.changeEtherBalances([acc2, payments], [-sum, sum]);

    await tx.wait()

    const newPayment = await payments.getPayment(acc2.address, 0)
    expect(newPayment.message).to.eq(msg)
    expect(newPayment.amount).to.eq(sum)
    expect(newPayment.from).to.eq(acc2.address)
  })
})