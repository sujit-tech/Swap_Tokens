// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;


contract Transactions {
    uint256 transactionCounter;

    event Transfer(
        address from,
        address to,
        uint amount,
        string message,
        uint256 timeStamp,
        string keyword
    );

    struct TransferStruct {
        address from;
        address to;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] public transactions;

    function addToBlockchain( 
        address payable _to,
        uint _amount,
        string memory _message,
        string memory _keyword) public{
            transactionCounter +=1;
        transactions.push(TransferStruct(msg.sender,_to, _amount,_message,block.timestamp ,_keyword));
        emit Transfer(msg.sender,_to, _amount,_message,block.timestamp ,_keyword);
        
    }
    function getTransactions() public view returns(TransferStruct[] memory){
        return transactions;
    }
    function getTransactionCount() public view returns(uint256){
        return transactionCounter;
    }
    }
// changes needed if we produce .env need to change bcoz of api.