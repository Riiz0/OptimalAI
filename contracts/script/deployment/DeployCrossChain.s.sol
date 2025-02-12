// script/DeployCrossChain.s.sol
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";
import {HelperConfig} from "../HelperConfig.s.sol";
import {SuperchainWrappedToken} from "../../src/superchain/SuperchainWrappedToken.sol";

contract DeployCrossChain is Script {
    function run() external {
        HelperConfig helper = new HelperConfig();
        address bridge = 0x4200000000000000000000000000000000000010;

        // Deploy to network
        vm.startBroadcast();
        (address wUSDC, address wWETH) = _deployForNetwork(helper.getOPSepoliaConfig(), bridge); // switch to getBaseSepoliaConfig() for Base Sepolia
        vm.stopBroadcast();

        console2.log("Deployed wUSDC:", wUSDC);
        console2.log("Deployed wWETH:", wWETH);
    }

    function _deployForNetwork(HelperConfig.NetworkConfig memory config, address bridge)
        internal
        returns (address, address)
    {
        // Deploy wrapped USDC
        SuperchainWrappedToken wUSDC =
            new SuperchainWrappedToken(config.usdc, "Superchain Optimial USDC", "wUSDC", bridge);

        // Deploy wrapped WETH
        SuperchainWrappedToken wWETH =
            new SuperchainWrappedToken(config.weth, "Superchain Optimial WETH", "wWETH", bridge);

        return (address(wUSDC), address(wWETH));
    }
}
