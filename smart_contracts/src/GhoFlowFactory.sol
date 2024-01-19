// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {GhoFlow} from "./GhoFlow.sol";

contract GhoFlowFactory {

    mapping(address => address) public senderToGhoFlow;

    constructor(){}

    function newStream(uint256 ghoAmount, address beneficiary) public payable{
        GhoFlow ghoflow;
        if (senderToGhoFlow[msg.sender]==address(0)){
            ghoflow = new GhoFlow(address(this), msg.sender);
            senderToGhoFlow[msg.sender] = address(ghoflow);
        }
        else {
            ghoflow = GhoFlow(senderToGhoFlow[msg.sender]);
        } 
        ghoflow.depositETHtoGHOStream{value: msg.value}(ghoAmount, beneficiary);
    }
}