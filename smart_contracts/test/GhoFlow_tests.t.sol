// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/StdCheats.sol";
import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPool} from "aave-v3-core/contracts/interfaces/IPool.sol";
import {GhoToken} from "gho-core/src/contracts/gho/GhoToken.sol";
import {IGhoToken} from "gho-core/src/contracts/gho/interfaces/IGhoToken.sol";
import {IWrappedTokenGatewayV3} from "aave-v3-periphery/contracts/misc/interfaces/IWrappedTokenGatewayV3.sol";

contract GhoTest is StdCheats, Test {

    GhoToken gho = GhoToken(0xc4bF5CbDaBE595361438F8c6a187bDc330539c60);
    IWrappedTokenGatewayV3 wtg = IWrappedTokenGatewayV3(0x387d311e47e80b498169e6fb51d3193167d89F7D);
    IPool pool = IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);

    address acc1 = vm.addr(1);

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("sepolia"));
        //console.log(acc1);
        vm.deal(acc1, 10 ether); //Fund address with 10 eth
        console.log(acc1.balance);
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

    

}