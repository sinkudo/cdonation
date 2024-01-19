// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionTiers {
    address public owner;
    uint nextId;

    struct SubscriptionTier {
        uint id;
        uint creatorId;
        string name;
        string description;
        uint price;
        uint roleId;
    }

    // Discord Server ID => SubscriptionTier[]
    mapping (uint => SubscriptionTier[]) private subscriptionTiers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event SubscriptionTierCreated(
        uint indexed nextId, 
        uint indexed creatorId,
        string indexed name,
        string description,
        uint price,
        uint roleId
    );

    /// Request: [serverID, userID, name, description, price, roleID]
    function createSubscriptionTier(
        uint _serverId, 
        uint _creatorId,
        string memory _name,
        string memory _description,
        uint _price,
        uint _roleId
    ) external onlyOwner {
        SubscriptionTier memory newTier = SubscriptionTier({
            id: nextId,
            creatorId: _creatorId,
            roleId: _roleId,
            name: _name,
            description: _description,
            price: _price
        });
        subscriptionTiers[_serverId].push(newTier);

        emit SubscriptionTierCreated(_serverId, _creatorId, _name, _description, _price, _roleId);

        nextId++;
    }

    function getCreatorIdByTierId(uint _serverId, uint _tierId) public view returns (uint) {
        SubscriptionTier memory tier = getById(_serverId, _tierId);
        return tier.creatorId;
    }

    function getPriceByTierId(uint _serverId, uint _tierId) public view returns (uint) {
        SubscriptionTier memory tier = getById(_serverId, _tierId);
        return tier.price;
    }

    // // server id, tierd id, name, desription, price
    function updateTier(
        uint _serverId, 
        uint _tierId, 
        string memory _name, 
        string memory _description, 
        uint _price
    ) public {
        SubscriptionTier[] storage tiers = subscriptionTiers[_serverId];
        uint arrayIndex = getArrayIndexById(_serverId, _tierId);

        tiers[arrayIndex].name = _name;
        tiers[arrayIndex].description = _description;
        tiers[arrayIndex].price = _price;
    }

    function getAllSubscriptionTiersByDiscordId(uint serverId) public view returns (SubscriptionTier[] memory) {
        return subscriptionTiers[serverId]; 
    }

    function getById(uint _serverId, uint _tierId) public view returns (SubscriptionTier memory) {
        SubscriptionTier[] memory tiers = getAllSubscriptionTiersByDiscordId(_serverId);
        for (uint i = 0; i < tiers.length; i++) {
            if (tiers[i].id == _tierId) {
                return tiers[i];
            }
        }

        revert("Tier not found");
    }

    function getArrayIndexById(uint _serverId, uint _tierId) internal view returns (uint) {
        SubscriptionTier[] memory tiers = getAllSubscriptionTiersByDiscordId(_serverId);
        for (uint i = 0; i < tiers.length; i++) {
            if (tiers[i].id == _tierId) {
                return i;
            }
        }

        revert("Tier not found");
    }
}