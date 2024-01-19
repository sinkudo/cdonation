// Subscriptions.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Subscriptions Contract", function () {
  let subscriptionsContract;
  let subscriptionTiersContract;
  let owner;
  let user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const SubscriptionTiers = await ethers.getContractFactory("SubscriptionTiers");
    subscriptionTiersContract = await SubscriptionTiers.connect(owner).deploy();
    await subscriptionTiersContract.waitForDeployment();

    const Subscriptions = await ethers.getContractFactory("Subscriptions");
    subscriptionsContract = await Subscriptions.connect(owner).deploy(subscriptionTiersContract.getAddress());
    await subscriptionsContract.waitForDeployment();
  });

  it("should create a subscription", async function () {
    const serverId = 1;
    const tierId = 0;
    const userId = 1;

    await subscriptionTiersContract.createSubscriptionTier(serverId, owner.address, "Tier1", "Description", ethers.parseEther("10.0"), 1);

    await subscriptionsContract.createSubscription(serverId, tierId, userId);

    const subscriptions = await subscriptionsContract.listSubs();

    expect(subscriptions.length).to.equal(1);
    expect(subscriptions[0].userId).to.equal(userId);
    expect(subscriptions[0].renewal).to.equal(true);
  });

  it("should renew a subscription", async function () {
    const serverId = 1;
    const tierId = 0;
    const userId = 1;

    await subscriptionTiersContract.createSubscriptionTier(serverId, owner.address, "Tier1", "Description", ethers.parseEther("10.0"), 1);

    await subscriptionsContract.createSubscription(serverId, tierId, userId);

    const initialEndTimestamp = (await subscriptionsContract.listSubs())[0].endTimestamp;

    await subscriptionsContract.renewSubscription(0);

    const renewedEndTimestamp = (await subscriptionsContract.listSubs())[0].endTimestamp;

    expect(renewedEndTimestamp).to.be.above(initialEndTimestamp);
  });

  it("should cancel a subscription", async function () {
    const serverId = 1;
    const tierId = 0;
    const userId = 1;

    await subscriptionTiersContract.createSubscriptionTier(serverId, owner.address, "Tier1", "Description", ethers.parseEther("10.0"), 1);

    await subscriptionsContract.createSubscription(serverId, tierId, userId);

    await subscriptionsContract.cancelSubscription(serverId, userId);

    const subscriptions = await subscriptionsContract.listSubs();

    expect(subscriptions[0].renewal).to.equal(false);
  });
});
