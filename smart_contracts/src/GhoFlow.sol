// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console.sol";

import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPool} from "aave-v3-core/contracts/interfaces/IPool.sol";
import {IGhoToken} from "gho-core/src/contracts/gho/interfaces/IGhoToken.sol";
import {IWrappedTokenGatewayV3} from "aave-v3-periphery/contracts/misc/interfaces/IWrappedTokenGatewayV3.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {CFAv1Forwarder} from "@superfluid-finance/ethereum-contracts/contracts/utils/CFAv1Forwarder.sol";


contract GhoFlow {

    // TODO - put addresses in constructor instead of hardcoded
    IGhoToken gho = IGhoToken(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);
    IWrappedTokenGatewayV3 wtg = IWrappedTokenGatewayV3(0x387d311e47e80b498169e6fb51d3193167d89F7D);
    IPool pool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
    ISuperToken ghox = ISuperToken(0x22064a21FEE226D8fFB8818E7627d5FF6D0Fc33a);
    CFAv1Forwarder cfav1 = CFAv1Forwarder(0xcfA132E353cB4E398080B9700609bb008eceB125);
    IERC20 ethAToken = IERC20(0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830);

    address public factory;
    address public sender;

    constructor(address _factory, address _sender){
        factory = _factory;
        sender = _sender;
    }

    function depositETHtoGHOStream(uint256 ghoAmount, int96 flowRate, address beneficiary) public payable onlyFactory{
        depositETHAndGetGHO(ghoAmount);
        createStream(ghoAmount, flowRate, beneficiary);
    }

    function depositTokensToGhoStream(address tokenAddress, uint256 ghoAmount, int96 flowRate, address beneficiary) public onlyFactory{
        depositTokensAndGetGHO(tokenAddress, ghoAmount);
        createStream(ghoAmount, flowRate, beneficiary);
    }

    function depositETHAndGetGHO(uint256 ghoAmount) internal {
        require(msg.value>0, "no value sent in transaction");
        wtg.depositETH{value : msg.value}(address(pool), address(this), 0); // Deposit ETH
        pool.borrow(address(gho), ghoAmount, 2, 0, address(this)); // Borrow GHO
    }

    function depositTokensAndGetGHO(address tokenAddress, uint256 ghoAmount) internal {
        uint256 tokenBalance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).approve(address(pool), tokenBalance);
        pool.supply(tokenAddress, tokenBalance, address(this), 0);
        pool.borrow(address(gho), ghoAmount, 2, 0, address(this)); // Borrow GHO
    }

    function createStream(uint256 ghoAmount, int96 flowRate, address beneficiary) internal{
        gho.approve(address(ghox), ghoAmount); // Approve supertoken to transfer gho
        ghox.upgrade(ghoAmount); // wrap gho -> ghox
        console.log(2);
        cfav1.createFlow(ghox, address(this), beneficiary, flowRate, ""); // Create flow
        console.log(3);
    }

    function updateStream(int96 flowRate, address beneficiary) public onlyFactory{
        cfav1.updateFlow(ghox, address(this), beneficiary, flowRate, new bytes(0)); // Update flow
    }

    function deleteStream(address beneficiary) public onlyFactory{
        cfav1.deleteFlow(ghox, address(this), beneficiary, new bytes(0)); // Delete flow
    }

    function repayGHO(uint256 amount) public {
        gho.transferFrom(sender, address(this), amount);
        gho.approve(address(pool), amount);
        pool.repay(address(gho), amount, 2, address(this));
    }

    function withdrawETH(uint256 amount) public onlyFactory{
        ethAToken.approve(address(wtg), amount);
        wtg.withdrawETH(address(pool), amount, sender);
    }

    function withdrawTokens(address tokenAddress, uint256 amount) public onlyFactory{
        pool.withdraw(tokenAddress, amount, sender);
    }

    modifier onlyFactory() {
        require(msg.sender == factory); // Only the factory addresss can interact with its clones
        _; // Continue with the function if the modifier condition is satisfied
    }


}