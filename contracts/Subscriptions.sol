// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/SubscriptionTiers.sol";

contract Subscriptions {
    SubscriptionTiers public subscriptionTiersInstance;

    uint nextId;

    struct Subscription {
        uint id;
        uint userId;
        uint subscriptionTierId;
        uint startTimestamp;
        uint endTimestamp;
        uint serverId;
        uint price;
    }

    Subscription[] public subscriptions;
    // mapping (uint => Subscription[]) private subscriptions;

    constructor(address subTiersAddress) {
        subscriptionTiersInstance = SubscriptionTiers(subTiersAddress);
    }
    event SubscriptionCreated(uint userId, uint roleId);

    function createSubscription(uint _serverId, uint _tierId, uint _userId) public returns (uint, uint) {
        SubscriptionTiers.SubscriptionTier memory tier = subscriptionTiersInstance.getById(_serverId, _tierId);
        Subscription memory newSub = Subscription({
            id: nextId,
            userId: _userId,
            subscriptionTierId: _tierId,
            startTimestamp: block.timestamp,
            endTimestamp: block.timestamp + 30 days,
            serverId: _serverId,
            price: tier.price
        });
        subscriptions.push(newSub);

        // SubscriptionTiers.SubscriptionTier memory tier = subscriptionTiersInstance.getSubscriptionById(_serverId, _tierId);

        // Subscription memory newSub = Subscription({
        //     id: nextId,
        //     subscriptionTierId: _tierId,
        //     startTimestamp: block.timestamp,
        //     endTimestamp: block.timestamp + 30 days
        // });
        // subscriptions[_userId].push(newSub);

        emit SubscriptionCreated(_userId, tier.roleId);

        nextId++;

        return (_userId, tier.roleId);
    }
    function listSubs() public view returns (Subscription[] memory) {
        return subscriptions;
    }
    // function func() public {
    //     for (uint i = 0; i < subscriptions.length; i++) {
            
    //     }
    // }
}
