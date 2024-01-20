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
import {GhoFlowFactory} from "../src/GhoFlowFactory.sol";


contract GhoTest is StdCheats, Test {

    // AAVE
    IWrappedTokenGatewayV3 wtg = IWrappedTokenGatewayV3(0x387d311e47e80b498169e6fb51d3193167d89F7D);
    IPool pool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);

    // Superfluid
    ISuperToken ghox = ISuperToken(0x22064a21FEE226D8fFB8818E7627d5FF6D0Fc33a);
    CFAv1Forwarder cfav1 = CFAv1Forwarder(0xcfA132E353cB4E398080B9700609bb008eceB125);

    // Tokens
    GhoToken gho = GhoToken(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);
    IERC20 dai = IERC20(0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357);
    IERC20 aave = IERC20(0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a);

    GhoFlow public ghoflow;
    GhoFlowFactory public ghoFlowFactory;

    address acc1 = vm.addr(1);
    address acc2 = vm.addr(2);
    address acc3 = vm.addr(3);

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("sepolia"));
        vm.deal(acc1, 10 ether); //Fund address with 10 eth
        vm.deal(acc2, 10 ether); 

        ghoFlowFactory = new GhoFlowFactory();

        vm.startPrank(acc1);
    }

    function test_sanityCheckGHOBalanceStartsAt0() public {
        assertEq(gho.balanceOf(acc1), 0);
    }

    function test_depositAndBorrowGHO() public {
        wtg.depositETH{value : 5 ether}(address(pool), acc1, 0); // Deposit 5 ETH
        pool.borrow(address(gho), 10 ether, 2, 0, acc1); // Borrow 10 dollars
        assertEq(gho.balanceOf(acc1), 10 ether);
    }

    function test_manualGetGHOandMakeFlow() public {

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

    function test_GhoFlowFactory_mvp() public {
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 0); // Sanity check that we start with 0 flow
        ghoFlowFactory.ethToGhoStream{value: 10 ether}(1 ether, 1, acc2);
        assertGt(cfav1.getAccountFlowrate(ghox, acc2), 0); // Check that now the flow is >0
    }

    function test_GhoFlowFactory_set_up_stream() public {

        // Sanity check that we start with 0 flow
        assertEq(cfav1.getAccountFlowrate(ghox, acc1), 0); 
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 0); 
        assertEq(cfav1.getAccountFlowrate(ghox, acc3), 0);

        // --- Acc 1 ---
        vm.startPrank(acc1);

        ghoFlowFactory.ethToGhoStream{value: 4 ether}(1 ether, 1, acc2);
        assertGt(cfav1.getAccountFlowrate(ghox, acc2), 0); // Check that now the flow is >0
        address acc1_ghoflow = ghoFlowFactory.senderToGhoFlow(acc1);
        ghoFlowFactory.ethToGhoStream{value: 4 ether}(1 ether, 1, acc3);
        assertGt(cfav1.getAccountFlowrate(ghox, acc3), 0); // Check that now the flow is >0
        assertEq(ghoFlowFactory.senderToGhoFlow(acc1), acc1_ghoflow);

        // --- Acc 2 ---
        vm.startPrank(acc2);

        ghoFlowFactory.ethToGhoStream{value: 4 ether}(1 ether, 1, acc3);
        assertGt(cfav1.getAccountFlowrate(ghox, acc3), 0); // Check that now the flow is >0
        assertNotEq(ghoFlowFactory.senderToGhoFlow(acc1), ghoFlowFactory.senderToGhoFlow(acc2));
    }

    function test_GhoFlowFactory_whole_cycle() public{

        // Acc1 creates a stream and gets GHO debt
        ghoFlowFactory.ethToGhoStream{value: 10 ether}(1000 ether, 1, acc1);

        // Acc2 borrows some GHO and sends it to Acc1
        vm.startPrank(acc2);
        uint256 startBalance = gho.balanceOf(acc1);
        assertEq(startBalance, 0);
        wtg.depositETH{value : 5 ether}(address(pool), acc2, 0); // Deposit 5 ETH
        pool.borrow(address(gho), 9999 ether, 2, 0, acc2); // Borrow 1000 dollars
        gho.transfer(acc1, 9999 ether);
        uint256 endBalance = gho.balanceOf(acc1);
        assertGt(endBalance, 0);

        // Acc1 repays its debt and can withdraw its ETH
        vm.startPrank(acc1);
        gho.approve(ghoFlowFactory.senderToGhoFlow(acc1), 99999 ether);
        ghoFlowFactory.repayAllGHO();
        assertEq(ghoFlowFactory.getTotalGHODebt(acc1), 0);
        startBalance = acc1.balance;
        ghoFlowFactory.withdrawAllETH();
        endBalance = acc1.balance;
        assertGt(endBalance, startBalance);
        assertEq(ghoFlowFactory.getSuppliedTotalETH(acc1), 0);
    }

    function test_GhoFlowFactory_stream_control() public {
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 0); // Check that we start with 0 flow
        ghoFlowFactory.ethToGhoStream{value: 10 ether}(1 ether, 333, acc2);
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 333); // Check that now the flow is >0
        ghoFlowFactory.updateStream(777, acc2);
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 777); // Check that now the flow is updated
        ghoFlowFactory.deleteStream(acc2);
        assertEq(cfav1.getAccountFlowrate(ghox, acc2), 0); // check that we end with 0 flow
    }

    function test_GloFlowFactory_tokens_as_supply() public {
        deal(address(dai), acc1, 1000e18); // top with 1000 DAI
        dai.approve(address(ghoFlowFactory), 1000e18);
        ghoFlowFactory.tokenToGhoStream(address(dai), 1000e18, 100e18, 5, acc2); // Supply 1000 DAI, borrow 500 GHO, create stream with 5GHO/s flowrate
        assertGt(cfav1.getAccountFlowrate(ghox, acc2), 0); // Check that now the incoming flow to acc2 is >0
        assertGt(ghoFlowFactory.getSuppliedTotalTokens(acc1, address(dai)), 0);

        deal(address(gho), acc1, 1000e18); // top with 1000 GHO
        gho.approve(ghoFlowFactory.senderToGhoFlow(acc1), 99999 ether); // approve gho
        ghoFlowFactory.repayAllGHO(); // repay all debt
        assertEq(ghoFlowFactory.getTotalGHODebt(acc1), 0); // check that there is 0 debt left
        uint256 startBalance = dai.balanceOf(acc1);
        ghoFlowFactory.withdrawAllTokens(address(dai)); // withdraw dai tokens
        uint256 endBalance = dai.balanceOf(acc1);
        assertGt(endBalance, startBalance);
        assertEq(ghoFlowFactory.getSuppliedTotalTokens(acc1, address(dai)), 0);
    }

    function test_GhoFlowFactory_several_assets() public {
        deal(address(dai), acc1, 1000e18); // top with 1000 DAI
        deal(address(aave), acc1, 1000e18); // top with 1000 USDC

        dai.approve(address(ghoFlowFactory), 1000e18);
        aave.approve(address(ghoFlowFactory), 1000e18);

        ghoFlowFactory.ethToGhoStream{value: 10 ether}(1000 ether, 1, address(0x1));
        ghoFlowFactory.tokenToGhoStream(address(dai), 1000e18, 500e18, 5, acc2); // Supply 1000 DAI, borrow 500 GHO, create stream with 5GHO/s flowrate
        ghoFlowFactory.tokenToGhoStream(address(aave), 1000e18, 500e18, 5, acc3); // Supply 1000 USDC, borrow 500 GHO, create stream with 5GHO/s flowrate
    }

    function test_GhoFlowFactory_multi_streams_with_one_deposit() public {
        ghoFlowFactory.ethToGhoStream{value: 10 ether}(1000 ether, 1, address(0x1));
        ghoFlowFactory.createStream(10000, 1, address(0x2));
        ghoFlowFactory.createStream(10000, 1, address(0x3));
    }

    function test_GhoFlowFactory_oracles() public {
        int256 ethPrice = ghoFlowFactory.getETHValueDollars();
        int256 daiPrice = ghoFlowFactory.getTokenValueDollars(address(dai));
        int256 aavePrice = ghoFlowFactory.getTokenValueDollars(address(aave));

        console.log(uint256(ethPrice));
        // Check vs sepolia mock oracles prices
        assertEq(ethPrice, 4000e8);
        assertEq(daiPrice, 1e8);
        assertEq(aavePrice, 300e8);
    }

}