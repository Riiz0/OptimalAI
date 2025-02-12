// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {SafeVaultDeployer} from "../.././src/SafeVaultDeployer.sol";

contract DeploySafeVaultDeployer is Script {
    function run() external returns (SafeVaultDeployer) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SafeVaultDeployer safeVaultDeployer = new SafeVaultDeployer();

        vm.stopBroadcast();

        return (safeVaultDeployer);
    }
}
