// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IPool} from "aave-v3-core/contracts/interfaces/IPool.sol";
import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IMockAggregator} from "./IMockAggregator.sol";

import {GhoFlow} from "./GhoFlow.sol";


contract GhoFlowFactory {

    // --- Sepolia Addresses ---

    IPool pool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
    IERC20 ghoDebtToken = IERC20(0x67ae46EF043F7A4508BD1d6B94DB6c33F0915844);
    IERC20 ethAToken = IERC20(0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830);

    mapping(address => address) public senderToGhoFlow;
    mapping(address => address) public tokenToAToken;
    mapping(address => address) public tokenToOracle;

    constructor(){
        tokenToAToken[0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357] = 0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8; // DAI
        tokenToAToken[0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a] = 0x6b8558764d3b7572136F17174Cb9aB1DDc7E1259; // AAVE
    
        tokenToOracle[0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357] = 0x9aF11c35c5d3Ae182C0050438972aac4376f9516; // DAI
        tokenToOracle[0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a] = 0xda678Ef100c13504edDb8a228A1e8e4CB139f189; // AVVE
    }

    // --- GhoFlow SUBCONTRACTS ---

    function ghoFlowManager() private returns (GhoFlow){
        GhoFlow ghoflow;
        if (senderToGhoFlow[msg.sender]==address(0)){
            ghoflow = new GhoFlow(address(this), msg.sender);
            senderToGhoFlow[msg.sender] = address(ghoflow);
        }
        else {
            ghoflow = GhoFlow(senderToGhoFlow[msg.sender]);
        } 
        return ghoflow;
    }

    // --- STREAM MANAGEMENT ---

    function ethToGhoStream(uint256 ghoAmount, int96 flowRate, address beneficiary) public payable{
        ghoFlowManager().depositETHtoGHOStream{value: msg.value}(ghoAmount, flowRate, beneficiary);
    }

    function tokenToGhoStream(address tokenAddress, uint256 tokenAmount, uint256 ghoAmount, int96 flowRate, address beneficiary) public {
        // Requires token approval before!
        GhoFlow ghoflow = ghoFlowManager();
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount);
        IERC20(tokenAddress).transfer(address(ghoflow), tokenAmount);
        ghoflow.depositTokensToGhoStream(tokenAddress, ghoAmount, flowRate, beneficiary);
    }  

    function createStream(uint256 ghoamount, int96 flowRate, address beneficiary) public {
        // Creates a superfluid stream without having to deposit collateral before
        require (senderToGhoFlow[msg.sender]!=address(0));
        GhoFlow(senderToGhoFlow[msg.sender]).createStream(ghoamount, flowRate, beneficiary);
    }
 
    function updateStream(int96 flowRate, address beneficiary) public {
        // Update the flowrate of a superfluid stream
        require (senderToGhoFlow[msg.sender]!=address(0));
        GhoFlow(senderToGhoFlow[msg.sender]).updateStream(flowRate, beneficiary);
    }

    function deleteStream(address beneficiary) public {
        // Delete a superfluid stream
        require (senderToGhoFlow[msg.sender]!=address(0));
        GhoFlow(senderToGhoFlow[msg.sender]).deleteStream(beneficiary);
    }

    // --- REPAY GHO ---

    function repayGHO(uint256 amount) public {
        GhoFlow(senderToGhoFlow[msg.sender]).repayGHO(amount);
    }

    function repayAllGHO() public {
        GhoFlow(senderToGhoFlow[msg.sender]).repayGHO(getTotalGHODebt(msg.sender));
    }

    // --- WITHDRAW ---

    function withdrawETH(uint256 amount) public {
        GhoFlow(senderToGhoFlow[msg.sender]).withdrawETH(amount);
    }

    function withdrawAllETH() public {
        GhoFlow(senderToGhoFlow[msg.sender]).withdrawETH(ethAToken.balanceOf(senderToGhoFlow[msg.sender]));
    }

    function withdrawTokens(address tokenAddress, uint256 amount) public {
        GhoFlow(senderToGhoFlow[msg.sender]).withdrawTokens(tokenAddress, amount);
    }

    function withdrawAllTokens(address tokenAddress) public {
        GhoFlow(senderToGhoFlow[msg.sender]).withdrawTokens(tokenAddress, IERC20(tokenToAToken[tokenAddress]).balanceOf(senderToGhoFlow[msg.sender]));
    }

    // --- GET FUNCTIONS ---

    function getInfo(address acc) public view returns (uint256, uint256, uint256, uint256){
        (uint256 collateralValueDollars, uint256 debtValueDollars, uint256 availableDebtValueDollars,,,uint256 healthFactor) =  pool.getUserAccountData(senderToGhoFlow[acc]);
        return (collateralValueDollars, debtValueDollars, availableDebtValueDollars, healthFactor);
    }

    function getTotalGHODebt(address acc) public view returns (uint256){
        return ghoDebtToken.balanceOf(senderToGhoFlow[acc]);
    }

    function getSuppliedTotalETH(address acc) public view returns (uint256){
        return ethAToken.balanceOf(senderToGhoFlow[acc]);
    }

    function getSuppliedTotalTokens(address acc, address tokenAddress) public view returns (uint256){
        return IERC20(tokenToAToken[tokenAddress]).balanceOf(senderToGhoFlow[acc]);
    }

    function getETHValueDollars() public view returns (int256){
        return IMockAggregator(0xDde0E8E6d3653614878Bf5009EDC317BC129fE2F).latestAnswer();
    }

    function getTokenValueDollars(address tokenAddress) public view returns (int256){
        return IMockAggregator(tokenToOracle[tokenAddress]).latestAnswer();
    }

}