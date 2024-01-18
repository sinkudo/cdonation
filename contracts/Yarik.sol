// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Yarik {
    address owner;
    Donation[] public donations;

    struct Donation {
        uint timestamp;
        address from;
        address to;
        uint amount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not an owner!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getMyBalance() public view returns (uint) {
        return msg.sender.balance;
    }

    function getBalance(address target) public view returns (uint) {
        return target.balance;
    }

    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }

    /////

    function deposit() public payable {

    } 

    function donate(address payable _to) public payable {
        Donation memory newDonation  = Donation({
            timestamp: block.timestamp,
            from: msg.sender,
            to: _to,
            amount: msg.value
        });
        donations.push(newDonation);
        
        _to.transfer(msg.value);
    }

    function withdrawAll() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}