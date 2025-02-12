// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";
import {HelperConfig} from "../../HelperConfig.s.sol";
import {SuperchainWrappedToken} from "../../../src/superchain/SuperchainWrappedToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EndWithMintOnOp is Script {
    function run() external {
        // Create fork for Optimism Sepolia
        uint256 opFork = vm.createSelectFork(vm.envString("OP_SEPOLIA_RPC_URL"));

        // Deploy HelperConfig on Optimism Sepolia
        vm.selectFork(opFork);
        HelperConfig opHelper = new HelperConfig();

        HelperConfig.NetworkConfig memory opConfig = opHelper.getBaseSepoliaConfig();

        // Use deployed token addresses
        address opSUSDC = 0x11b670CC983e568208BcA0EdD529A1e19bfeF5F0; // wUSDC on Optimism Sepolia

        // Broadcasted part: Mint sUSDC
        vm.startBroadcast(vm.envAddress("USER")); // Set tx.origin to USER
        _approveAndWithdraw(opSUSDC, opConfig.usdc);
        _mint(opSUSDC);
        vm.stopBroadcast();
    }

    function _approveAndWithdraw(address baseToken, address underlyingUSDC) internal {
        // Simulate deposit on Base Sepolia
        SuperchainWrappedToken pUSDCBase = SuperchainWrappedToken(baseToken);
        IERC20 usdc = IERC20(underlyingUSDC);
        uint256 amount = 1e6; // USDC has 6 decimals

        // Approve the SuperchainWrappedToken contract to spend USDC
        usdc.approve(baseToken, amount);

        // Deposit USDC into the SuperchainWrappedToken contract
        pUSDCBase.withdraw(amount); // msg.sender is USER (set in vm.startBroadcast)
    }

    function _mint(address opToken) internal {
        // Simulate bridge mint on Optimism Sepolia
        SuperchainWrappedToken sUSDCOptimism = SuperchainWrappedToken(opToken);
        uint256 amount = 1e6; // USDC has 6 decimals

        // Mint sUSDC
        sUSDCOptimism.crosschainMint(vm.envAddress("USER"), amount);
        console2.log("Mint complete!");
    }
}
