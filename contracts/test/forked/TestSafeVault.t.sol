// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SafeVault} from "../../src/SafeVault.sol";
import {SafeVaultDeployer} from "../../src/SafeVaultDeployer.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultTest is Test {
    HelperConfig public helperConfig;
    HelperConfig.NetworkConfig public networkConfig;
    address owner = address(1);
    address user = address(2);
    SafeVaultDeployer public vaultDeployer;
    uint256 fork;
    string BASE_SEPOLIA_RPC_URL_2 = vm.envString("BASE_SEPOLIA_RPC_URL_2");
    string ARBITRUM_SEPOLIA_RPC_URL = vm.envString("ARBITRUM_SEPOLIA_RPC_URL");

    function setUp() public {
        helperConfig = new HelperConfig();
        networkConfig = helperConfig.getArbitrumSepoliaConfig();
        fork = vm.createSelectFork(ARBITRUM_SEPOLIA_RPC_URL);
        vm.startPrank(owner);
        vaultDeployer = new SafeVaultDeployer();
        vm.stopPrank();
        deal(networkConfig.usdc, user, 100 * 1e6);
    }

    function testCreateVault() public {
        vm.startPrank(user);
        address _vault = vaultDeployer.deployVault(user);
        SafeVault vault = SafeVault(_vault);
        assertEq(vault.owner(), user);
        vm.stopPrank();
    }

    function testDepositERC20() public {
        vm.startPrank(user);
        address _vault = vaultDeployer.deployVault(user);
        SafeVault vault = SafeVault(_vault);
        IERC20(networkConfig.usdc).approve(address(vault), 100 * 1e6);
        vault.depositERC20intoVault(networkConfig.usdc, 100 * 1e6);
        assertEq(IERC20(networkConfig.usdc).balanceOf(user), 0);
        assertEq(IERC20(networkConfig.usdc).balanceOf(address(vault)), 100 * 1e6);
        SafeVault.Investment memory userBalance = vault.getUserStruct(networkConfig.usdc);
        assertEq(userBalance.balanceUnderlying, 100 * 1e6);
        vm.stopPrank();
    }

    function testWithdrawERC20() public {
        vm.startPrank(user);
        address _vault = vaultDeployer.deployVault(user);
        SafeVault vault = SafeVault(_vault);
        IERC20(networkConfig.usdc).approve(address(vault), 100 * 1e6);
        vault.depositERC20intoVault(networkConfig.usdc, 100 * 1e6);
        vault.withdrawERC20FromVault(networkConfig.usdc, 100 * 1e6);
        assertEq(IERC20(networkConfig.usdc).balanceOf(user), 100 * 1e6);
        assertEq(IERC20(networkConfig.usdc).balanceOf(address(vault)), 0);
        vm.stopPrank();
    }
}
