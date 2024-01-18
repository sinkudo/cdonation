// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Users {
    // Discord ID => address
    mapping (uint => address) users;

    function createUser(uint discordId, address addr) public {
        users[discordId] = addr;
    }

    function getAddress(uint discordId) public view returns (address) {
        return users[discordId];
    }
}
