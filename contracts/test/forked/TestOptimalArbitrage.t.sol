// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SafeVault} from "../../src/SafeVault.sol";
import {OptimalArbitrage} from "../../src/OptimalArbitrage.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArbitrageTest is Test {
    HelperConfig public helperConfig;
    HelperConfig.NetworkConfig public networkConfig;
    address owner = address(1);
    address user = address(2);
    OptimalArbitrage public arbitrage;
    uint256 fork;
    string BASE_SEPOLIA_RPC_URL_2 = vm.envString("BASE_SEPOLIA_RPC_URL_2");

    function setUp() public {
        helperConfig = new HelperConfig();
        networkConfig = helperConfig.getBaseSepoliaConfig();
        fork = vm.createSelectFork(BASE_SEPOLIA_RPC_URL_2);
        vm.startPrank(owner);
        arbitrage = new OptimalArbitrage();
        vm.stopPrank();
        deal(networkConfig.usdc, user, 100 * 1e6);
    }

    // function testFakeArbitrage() public {
    //     vm.startPrank(user);
    //     IERC20(networkConfig.usdc).approve(address(arbitrage), 2 * 1e6);
    //     IERC20(networkConfig.usdc).transfer(address(arbitrage), 2 * 1e6);

    //     // Create dynamic arrays
    //     address[] memory routers = new address[](2);
    //     routers[0] = networkConfig.uniswapRouter;
    //     routers[1] = networkConfig.uniswapRouter;

    //     address[] memory tokens = new address[](2);
    //     tokens[0] = networkConfig.usdc;
    //     tokens[1] = networkConfig.weth;

    //     arbitrage.fakeArbitrage(routers, tokens, 3000, 1 * 1e6);
    //     vm.stopPrank();
    // }
}
