// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/StdCheats.sol";
import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPool} from "aave-v3-core/contracts/interfaces/IPool.sol";
import {GhoToken} from "gho-core/src/contracts/gho/GhoToken.sol";
import {IGhoToken} from "gho-core/src/contracts/gho/interfaces/IGhoToken.sol";
import {IWrappedTokenGatewayV3} from "aave-v3-periphery/contracts/misc/interfaces/IWrappedTokenGatewayV3.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {CFAv1Forwarder} from "@superfluid-finance/ethereum-contracts/contracts/utils/CFAv1Forwarder.sol";
import {GhoFlow} from "../src/GhoFlow.sol";


contract GhoTest is StdCheats, Test {

    GhoToken gho = GhoToken(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);
    IWrappedTokenGatewayV3 wtg = IWrappedTokenGatewayV3(0x387d311e47e80b498169e6fb51d3193167d89F7D);
    IPool pool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
    ISuperToken ghox = ISuperToken(0x22064a21FEE226D8fFB8818E7627d5FF6D0Fc33a);
    CFAv1Forwarder cfav1 = CFAv1Forwarder(0xcfA132E353cB4E398080B9700609bb008eceB125);

    GhoFlow public ghoflow;

    address acc1 = vm.addr(1);
    address acc2 = vm.addr(2);

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("sepolia"));
        vm.deal(acc1, 10 ether); //Fund address with 10 eth

        ghoflow = new GhoFlow(); // Deploy ghoflow contract
    }

    function test_sanityCheckGHOBalanceStartsAt0() public {
        assertEq(gho.balanceOf(acc1), 0);
    }

    function test_depositAndBorrowGHO() public {
        vm.startPrank(acc1);
        wtg.depositETH{value : 5 ether}(address(pool), acc1, 0); // Deposit 5 ETH
        pool.borrow(address(gho), 10 ether, 2, 0, acc1); // Borrow 10 dollars
        assertEq(gho.balanceOf(acc1), 10 ether);
    }

    function test_manualGetGHOandMakeFlow() public {
        vm.startPrank(acc1);

        // --- Get GHO ---
        wtg.depositETH{value : 5 ether}(address(pool), acc1, 0); // Deposit 5 ETH
        pool.borrow(address(gho), 10 ether, 2, 0, acc1); // Borrow 10 dollars

        // --- Create superfluid stream ---
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 0); // Sanity check that we start with 0 flow
        gho.approve(address(ghox), gho.balanceOf(acc1)); // Approve supertoken to transfer gho
        ghox.upgrade(gho.balanceOf(acc1)); // wrap gho -> ghox
        cfav1.createFlow(ghox, acc1, acc2, 10000, ""); // Create flow

        vm.roll(1000); // advance time
        assertGt(cfav1.getAccountFlowrate(ghox, acc2), 0); // Check that now the flow is >0
    }   

    function test_GhoFlowSmartContract() public {
        vm.startPrank(acc1);

        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 0); // Sanity check that we start with 0 flow

        ghoflow.depositETHtoGHOStream{value: 10 ether}(10 ether, acc2);

        vm.roll(1000); // advance time
        assertGt(cfav1.getAccountFlowrate(ghox, acc2), 0); // Check that now the flow is >0
    }

}