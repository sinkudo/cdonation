// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionTiers {
    uint nextId;

    struct SubscriptionTier {
        uint id;
        uint creatorId;
        uint roleId;
        string name;
        string description;
        uint price;
    }

    // Discrord Server ID => SubscriptionTier[]
    mapping (uint => SubscriptionTier[]) subscriptionTiers;

    /// Request: [serverID, userID, name, description, price, roleID]
    function createSubscriptionTier(
        uint serverId, 
        uint _creatorId,
        string memory _name,
        string memory _description,
        uint _price,
        uint _roleId
    ) public {
        SubscriptionTier memory newTier = SubscriptionTier({
            id: nextId,
            creatorId: _creatorId,
            roleId: _roleId,
            name: _name,
            description: _description,
            price: _price
        });
        subscriptionTiers[serverId].push(newTier);
        nextId++;
    }

    function getAllSubscriptionTiersByDiscordId(uint serverId) public view returns (SubscriptionTier[] memory) {
        return subscriptionTiers[serverId]; 
    }
}