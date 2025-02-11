// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {CompoundUSDCMock} from "../../../src/mocks/CompoundUSDCMock.sol";

contract DeployMockCompoundUSDC is Script {
    function run() external returns (CompoundUSDCMock) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        CompoundUSDCMock mockCompoundUSDC = new CompoundUSDCMock();

        vm.stopBroadcast();

        return (mockCompoundUSDC);
    }
}
