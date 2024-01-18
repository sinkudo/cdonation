// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payments {
    struct Payment {
        uint timestamp;
        address from;
        address to;
        uint value;
    }

    Payment[] payments;

    function getAllPayments() public view returns (Payment[] memory) {
        return payments;
    }

    function makePayment(address payable _to) public payable {
        Payment memory newPayment  = Payment({
            timestamp: block.timestamp,
            from: msg.sender,
            to: _to,
            value: msg.value
        });
        payments.push(newPayment);
        
        _to.transfer(msg.value);
    }

    function deposit() public payable {
        Payment memory newPayment  = Payment({
            timestamp: block.timestamp,
            from: msg.sender,
            to: address(this),
            value: msg.value
        });
        payments.push(newPayment);
    }
}