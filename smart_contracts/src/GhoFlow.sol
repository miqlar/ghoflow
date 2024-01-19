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

    constructor(){}

    function depositETHtoGHOStream(uint256 ghoAmount, address beneficiary) public payable{
        depositAndGetGHO(ghoAmount);
        createStream(ghoAmount, beneficiary);
    }

    function depositAndGetGHO(uint256 ghoAmount) internal {
        require(msg.value>0, "no value sent in transaction");
        wtg.depositETH{value : msg.value}(address(pool), address(this), 0); // Deposit ETH
        pool.borrow(address(gho), ghoAmount, 2, 0, address(this)); // Borrow GHO
    }

    function createStream(uint256 ghoAmount, address beneficiary) internal{
        gho.approve(address(ghox), ghoAmount); // Approve supertoken to transfer gho
        ghox.upgrade(ghoAmount); // wrap gho -> ghox
        cfav1.createFlow(ghox, address(this), beneficiary, 10000, ""); // Create flow
    }

}