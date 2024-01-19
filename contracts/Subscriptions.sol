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
        bool renewal;
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
            price: tier.price,
            renewal: true
        });
        subscriptions.push(newSub);

        emit SubscriptionCreated(_userId, tier.roleId);

        nextId++;

        return (_userId, tier.roleId);
    }

    function renewSubscription(uint _subId) public {
        for (uint i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].id == _subId) {
                subscriptions[i].endTimestamp += 30 days;
                return;
            }
        }

        revert("Sub not found");
    }

    function getRenewalStatus(uint _subId) external view returns (bool){
        for (uint i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].id == _subId) {
                return subscriptions[i].renewal;
            }
        }

        revert("Sub not found");
    }

    function cancelSubscription(uint _serverId, uint _userId) public { // add tierID, `cause chel can buy multiple tiers on server  
        for (uint i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].serverId == _serverId && subscriptions[i].userId == _userId) {
                subscriptions[i].renewal = false;
                return;
            }

        }

        revert("Sub not found");
    }

    function listSubs() public view returns (Subscription[] memory) {
        return subscriptions;
    }
}
