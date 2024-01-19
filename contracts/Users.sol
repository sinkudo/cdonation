// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Users {
    address public owner;

    mapping (uint => address) public users;
    address[] addresses;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event UserCreated(uint indexed discordId, address indexed addr);

    function createUser(uint discordId, address addr) external onlyOwner {
        addresses.push(addr);
        users[discordId] = addr;
        emit UserCreated(discordId, addr);
    }

    function getAddress(uint discordId) external view returns (address) {
        return users[discordId];
    }

    function getAddressTest(uint discordId) external view returns (address) {
        return users[discordId];
    }
}
