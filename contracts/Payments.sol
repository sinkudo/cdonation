// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payments {
    address public owner;

    struct Payment {
        uint timestamp;
        address from;
        address to;
        uint value;
    }

    Payment[] payments;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getAllPayments() public view returns (Payment[] memory) {
        return payments;
    }

    function logPayment(uint _timestamp, address _from, address _to, uint _value) public {
        Payment memory newPayment = Payment({
            timestamp: _timestamp,
            from: _from,
            to: _to,
            value: _value
        });
        payments.push(newPayment);
    }

    function makePayment(address payable _to) public payable {
        logPayment(block.timestamp, msg.sender, _to, msg.value);
        _to.transfer(msg.value);
    }

    function deposit() public payable {
        logPayment(block.timestamp, msg.sender, address(this), msg.value);
    }

    function withdrawAll() public payable onlyOwner {
        logPayment(block.timestamp, address(this), owner, address(this).balance);
        payable(owner).transfer(address(this).balance);
    } 
}