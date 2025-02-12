// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";
import {HelperConfig} from "../../HelperConfig.s.sol";
import {SuperchainWrappedToken} from "../../../src/superchain/SuperchainWrappedToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StartWithBaseDepositBurn is Script {
    function run() external {
        // Create fork for Base Sepolia
        uint256 baseFork = vm.createSelectFork(vm.envString("BASE_SEPOLIA_RPC_URL_2"));

        // Deploy HelperConfig on Base Sepolia
        vm.selectFork(baseFork);
        HelperConfig baseHelper = new HelperConfig();

        // Load Base Sepolia config
        HelperConfig.NetworkConfig memory baseConfig = baseHelper.getBaseSepoliaConfig();

        // Use deployed token addresses
        address basepUSDC = 0x6F1338cbb22cD90b852492c3E77cd79a6C3c1551; // wUSDC on Base Sepolia
        address bridge = 0x4200000000000000000000000000000000000010; // Bridge address

        // Broadcasted part: Approve, deposit, and burn
        vm.startBroadcast(vm.envAddress("USER")); // Set tx.origin to USER
        _approveAndDeposit(basepUSDC, baseConfig.usdc);
        _burn(basepUSDC);
        vm.stopBroadcast();
    }

    function _approveAndDeposit(address baseToken, address underlyingUSDC) internal {
        // Simulate deposit on Base Sepolia
        SuperchainWrappedToken pUSDCBase = SuperchainWrappedToken(baseToken);
        IERC20 usdc = IERC20(underlyingUSDC);
        uint256 amount = 1e6; // USDC has 6 decimals

        // Approve the SuperchainWrappedToken contract to spend USDC
        usdc.approve(baseToken, amount);

        // Deposit USDC into the SuperchainWrappedToken contract
        pUSDCBase.deposit(amount); // msg.sender is USER (set in vm.startBroadcast)
    }

    function _burn(address baseToken) internal {
        // Simulate bridge burn
        SuperchainWrappedToken pUSDCBase = SuperchainWrappedToken(baseToken);
        uint256 amount = 1e6; // USDC has 6 decimals

        // Burn pUSDC (msg.sender is USER, set in vm.startBroadcast)
        pUSDCBase.crosschainBurn(vm.envAddress("USER"), amount);
        console2.log("Burn complete!");
    }
}
