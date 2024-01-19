// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/SubscriptionTiers.sol";

contract Subscriptions {
    SubscriptionTiers public subscriptionTiersInstance;

    uint nextId;

    struct Subscription {
        uint id;
        uint subscriptionTierId;
        uint startTimestamp;
        uint endTimestamp;
    }

    mapping (uint => Subscription[]) private subscriptions;

    constructor(address subTiersAddress) {
        subscriptionTiersInstance = SubscriptionTiers(subTiersAddress);
    }

    event SubscriptionCreated(uint userId, uint roleId);

    function createSubscription(uint _serverId, uint _tierId, uint _userId) public returns (uint, uint) {
        SubscriptionTiers.SubscriptionTier memory tier = subscriptionTiersInstance.getSubscriptionById(_serverId, _tierId);

        Subscription memory newSub = Subscription({
            id: nextId,
            subscriptionTierId: _tierId,
            startTimestamp: block.timestamp,
            endTimestamp: block.timestamp + 30 days
        });
        subscriptions[_userId].push(newSub);

        emit SubscriptionCreated(_userId, tier.roleId);

        nextId++;

        return (_userId, tier.roleId);
    }
}
