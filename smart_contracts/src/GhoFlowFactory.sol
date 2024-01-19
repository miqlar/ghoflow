// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IPool} from "aave-v3-core/contracts/interfaces/IPool.sol";
import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

import {GhoFlow} from "./GhoFlow.sol";

contract GhoFlowFactory {

    IPool pool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
    IERC20 ghoDebtToken = IERC20(0x67ae46EF043F7A4508BD1d6B94DB6c33F0915844);
    IERC20 ethAToken = IERC20(0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830);

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

    // 

    function repayGHO(uint256 amount) public {
        GhoFlow(senderToGhoFlow[msg.sender]).repayGHO(amount);
    }

    function repayAllGHO() public {
        GhoFlow(senderToGhoFlow[msg.sender]).repayGHO(getTotalGHODebt(msg.sender));
    }

    function withdrawETH(uint256 amount) public {
        GhoFlow(senderToGhoFlow[msg.sender]).withdrawETH(amount);
    }

    function withdrawAllETH() public {
        GhoFlow(senderToGhoFlow[msg.sender]).withdrawETH(ethAToken.balanceOf(senderToGhoFlow[msg.sender]));
    }

    // --- GET FUNCTIONS ---

    function getAccountHealthFactor(address acc) public view returns (uint256){
        (,,,,,uint256 healthFactor) =  pool.getUserAccountData(senderToGhoFlow[acc]);
        return healthFactor;
    }

    function getTotalGHODebt(address acc) public view returns (uint256){
        return ghoDebtToken.balanceOf(senderToGhoFlow[acc]);
    }

    function getSuppliedTotalETH(address acc) public view returns (uint256){
        return ethAToken.balanceOf(senderToGhoFlow[acc]);
    }


}