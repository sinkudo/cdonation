// SubscriptionTiers.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SubscriptionTiers Contract", function () {
  let subscriptionTiersContract;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const SubscriptionTiers = await ethers.getContractFactory("SubscriptionTiers");
    subscriptionTiersContract = await SubscriptionTiers.connect(owner).deploy();
    await subscriptionTiersContract.waitForDeployment();
  });

  it("should get by tier id", async function () {
    const serverId = 1;
    const creatorId = 1;
    const name = "Brilliant";
    const description = "Access to PREMIUM";
    const price = ethers.parseEther("100.0");
    const roleId = 2;

    await subscriptionTiersContract.createSubscriptionTier(
      serverId,
      creatorId,
      name,
      description,
      price,
      roleId
    );

    const createdTier = await subscriptionTiersContract.getById(serverId, 0);

    expect(createdTier.creatorId).to.equal(creatorId);
    expect(createdTier.name).to.equal(name);
    expect(createdTier.description).to.equal(description);
    expect(createdTier.price).to.equal(price);
    expect(createdTier.roleId).to.equal(roleId);
  });

  it("should get creator id getCreatorId()", async function () {
    const serverId = 1;
    const creatorId = 17;
    const name = "Level 2";
    const description = "Description...";
    const price = ethers.parseEther("1.0");
    const roleId = 2;

    await subscriptionTiersContract.createSubscriptionTier(
      serverId,
      creatorId,
      name,
      description,
      price,
      roleId
    );

    const gettedCreaterId = await subscriptionTiersContract.getCreatorIdByTierId(serverId, 0)

    expect(gettedCreaterId).to.equal(17);
  });
  
  it("should create a subscription tier", async function () {
    const serverId = 1;
    const creatorId = 1;
    const name = "Gold";
    const description = "Access to premium features";
    const price = ethers.parseEther("10.0");
    const roleId = 2;

    await subscriptionTiersContract.createSubscriptionTier(
      serverId,
      creatorId,
      name,
      description,
      price,
      roleId
    );

    const createdTier = await subscriptionTiersContract.getById(serverId, 0);

    expect(createdTier.creatorId).to.equal(creatorId);
    expect(createdTier.name).to.equal(name);
    expect(createdTier.description).to.equal(description);
    expect(createdTier.price).to.equal(price);
    expect(createdTier.roleId).to.equal(roleId);
  });

  it("should update a subscription tier", async function () {
    const serverId = 1;
    const creatorId = 1;
    const name = "Silver";
    const description = "Access to basic features";
    const price = ethers.parseEther("5.0");
    const roleId = 1;

    await subscriptionTiersContract.createSubscriptionTier(
      serverId,
      creatorId,
      "InitialTier",
      "InitialDescription",
      ethers.parseEther("1.0"),
      roleId
    );

    const tier = await subscriptionTiersContract.getById(serverId, 0);
    expect(tier.name).to.equal("InitialTier");
    expect(tier.description).to.equal("InitialDescription");
    expect(tier.price).to.equal(ethers.parseEther("1.0"));
    expect(tier.roleId).to.equal(roleId);


    await subscriptionTiersContract.updateTier(serverId, 0, name, description, price);

    const updatedTier = await subscriptionTiersContract.getById(serverId, 0);

    expect(updatedTier.name).to.equal(name);
    expect(updatedTier.description).to.equal(description);
    expect(updatedTier.price).to.equal(price);
    expect(updatedTier.roleId).to.equal(roleId);
  });
});
