// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Subscriptions {
    uint nextId;
    // Оформление подписки
    // Request: [serverID, tierID, userID]
    // Response: [userID, roleID]

    struct Subscription {
        uint id;
        uint subscriptionTierId;
        uint startTimestamp;
        uint endTimestamp;
    }

    mapping (uint => Subscription[]) subscriptions;

    function createSubscription(uint _serverId, uint _tierId, uint _userId) public {
        Subscription memory newSub = Subscription({
            id: nextId,
            subscriptionTierId: _tierId,
            startTimestamp: block.timestamp,
            endTimestamp: block.timestamp + 30 days
        });
        subscriptions[_userId].push(newSub);
        nextId++;
    }
}