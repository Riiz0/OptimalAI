// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";

contract HelperConfig is Script {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error HelperConfig__InvalidChainId();

    /*//////////////////////////////////////////////////////////////
                                 TYPES
    //////////////////////////////////////////////////////////////*/

    struct NetworkConfig {
        address weth;
        address usdc;
        address aaveUsdc; // "a tokens" recieved after supplying liquidity in aave V3
        address compoundUsdc;
        address uniswapFactory; // Uniswap V3
        address uniswapRouter; //Uniswap V3
        address uniswapQouter; // Uniswap V3
        address aavePool; // Aave V3
        address agent;
    }

    /*//////////////////////////////////////////////////////////////
                                CONFIGS
    //////////////////////////////////////////////////////////////*/
    function getBaseSepoliaConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory BaseSepoliaConfig = NetworkConfig({
            weth: 0x4200000000000000000000000000000000000006,
            usdc: 0x036CbD53842c5426634e7929541eC2318f3dCF7e,
            aaveUsdc: 0xfE45Bf4dEF7223Ab1Bf83cA17a4462Ef1647F7FF,
            compoundUsdc: 0x571621Ce60Cebb0c1D442B5afb38B1663C6Bf017,
            uniswapFactory: 0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24,
            uniswapRouter: 0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4,
            uniswapQouter: 0xC5290058841028F1614F3A6F0F5816cAd0df5E27,
            aavePool: 0xbE781D7Bdf469f3d94a62Cdcc407aCe106AEcA74,
            agent: 0x7e393441Edc1Bb1621318E000cDfC74947f23b26
        });
        return BaseSepoliaConfig;
    }

    function getArbitrumSepoliaConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory ArbitrumSepoliaConfig = NetworkConfig({
            weth: 0x1dF462e2712496373A347f8ad10802a5E95f053D,
            usdc: 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d,
            aaveUsdc: 0x460b97BD498E1157530AEb3086301d5225b91216,
            compoundUsdc: 0xfb4561C6AFF45c00EE0D2eF33D058E2F96959f0F, // Mock compound usdc
            uniswapFactory: 0x248AB79Bbb9bC29bB72f7Cd42F17e054Fc40188e,
            uniswapRouter: 0x101F443B4d1b059569D643917553c771E1b9663E,
            uniswapQouter: 0x2779a0CC1c3e0E44D2542EC3e79e3864Ae93Ef0B,
            aavePool: 0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff,
            agent: 0x7e393441Edc1Bb1621318E000cDfC74947f23b26
        });
        return ArbitrumSepoliaConfig;
    }

    function getAvaxFujiConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory AvaxFujiConfig = NetworkConfig({
            weth: address(0),
            usdc: 0x5425890298aed601595a70AB815c96711a31Bc65,
            aaveUsdc: 0x9CFcc1B289E59FBe1E769f020C77315DF8473760,
            compoundUsdc: address(0),
            uniswapFactory: address(0),
            uniswapRouter: address(0),
            uniswapQouter: address(0),
            aavePool: 0x8B9b2AF4afB389b4a70A474dfD4AdCD4a302bb40,
            agent: address(77)
        });
        return AvaxFujiConfig;
    }

    function getETHSepoliaConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory ETHSepoliaConfig = NetworkConfig({
            weth: 0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c,
            usdc: 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8,
            aaveUsdc: address(0),
            compoundUsdc: 0xE3E0106227181958aBfbA960C13d0Fe52c733265,
            uniswapFactory: address(0),
            uniswapRouter: address(0),
            uniswapQouter: address(0),
            aavePool: 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951,
            agent: address(77)
        });
        return ETHSepoliaConfig;
    }

    /*//////////////////////////////////////////////////////////////
                              LOCAL CONFIG
    //////////////////////////////////////////////////////////////*/
    function getAnvilConfig() public pure returns (NetworkConfig memory) {
        console2.log("Testing On Anvil Network");
        NetworkConfig memory AnvilConfig = NetworkConfig({
            weth: address(0),
            usdc: address(1),
            aaveUsdc: address(0),
            compoundUsdc: address(0),
            uniswapFactory: address(2),
            uniswapRouter: address(3),
            uniswapQouter: address(6),
            aavePool: address(7),
            agent: address(77)
        });
        return AnvilConfig;
    }
}
