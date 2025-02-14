// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SafeVaultDeployer} from "../../src/SafeVaultDeployer.sol";
import {SafeVault} from "../../src/SafeVault.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {TickMath} from "../../src/lib/TickMath.sol";
import {ProtocolHelper} from "../../src/ProtocolHelper.sol";
import {IUniswapV3Factory} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

contract ProtocolHelperTest is Test {
    SafeVaultDeployer public safeVaultDeployer;
    SafeVault public vault;
    ProtocolHelper public helper;
    HelperConfig public helperConfig;
    HelperConfig.NetworkConfig public networkConfig;
    address owner = address(99);
    address link = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
    uint256 sepoliaFork;
    uint256 fork;
    string ETH_SEPOLIA_RPC_URL = vm.envString("ETH_SEPOLIA_RPC_URL");
    string BASE_SEPOLIA_RPC_URL = vm.envString("BASE_SEPOLIA_RPC_URL");
    string ARBITRUM_SEPOLIA_RPC_URL = vm.envString("ARBITRUM_SEPOLIA_RPC_URL");
    string AVALANCHE_FUJI_RPC_URL = vm.envString("AVALANCHE_FUJI_RPC_URL");

    function setUp() public {
        helperConfig = new HelperConfig();
        networkConfig = helperConfig.getBaseSepoliaConfig();
        fork = vm.createSelectFork(BASE_SEPOLIA_RPC_URL);

        vm.startPrank(owner);
        safeVaultDeployer = new SafeVaultDeployer();
        address _vault = safeVaultDeployer.deployVault(owner);
        vault = SafeVault(_vault);
        helper = new ProtocolHelper(
            networkConfig.aavePool,
            networkConfig.compoundUsdc,
            networkConfig.uniswapRouter,
            networkConfig.uniswapFactory,
            networkConfig.nonFungiblePositionManager
        );

        deal(networkConfig.usdc, owner, 10000 * 1e6);
        deal(link, owner, 10000 * 1e18);
        deal(networkConfig.weth, owner, 10000 * 1e18);
        deal(networkConfig.usdc, address(helper), 10000 * 1e18);
        deal(networkConfig.weth, address(helper), 10000 * 1e18);
        deal(link, address(helper), 10000 * 1e18);

        IERC20(networkConfig.usdc).approve(address(vault), 100 * 1e6);
        IERC20(networkConfig.weth).approve(address(vault), 100 * 1e18);
        vault.depositERC20intoVault(networkConfig.usdc, 100 * 1e6);
        vault.depositERC20intoVault(networkConfig.weth, 100 * 1e18);

        vault.addWhitelistedAddress(owner);
        vm.stopPrank();
    }

    function testSupplyUSDCOnAave() public {
        vm.startPrank(owner);
        vault.lendERC20("aave", networkConfig.usdc, 10 * 1e6);
        (uint256 totalCollateralBase, , , , , ) = vault.getAaveAccountData();
        SafeVault.Investment memory userBalance = vault.getUserStruct(
            networkConfig.usdc
        );
        assertEq(userBalance.balanceInvestedInAave, 10 * 1e6);
        assertEq(userBalance.balanceUnderlying, 90 * 1e6);
        assertGt(totalCollateralBase, 0);
        assertEq(
            IERC20(networkConfig.aaveUsdc).balanceOf(address(vault)),
            10 * 1e6
        );
        vm.stopPrank();
    }

    function testWithdrawUSDCFromAave() public {
        vm.startPrank(owner);
        vault.lendERC20("aave", networkConfig.usdc, 10 * 1e6);
        uint256 amountWithdrawn = vault.withdrawLentERC20(
            "aave",
            networkConfig.usdc,
            5 * 1e6
        );
        assertEq(amountWithdrawn, 5 * 1e6);
        (uint256 totalCollateralBase, , , , , ) = vault.getAaveAccountData();
        assertGt(totalCollateralBase, 0);
        SafeVault.Investment memory userBalance = vault.getUserStruct(
            networkConfig.usdc
        );
        assertEq(userBalance.balanceUnderlying, 95 * 1e6);
        assertEq(
            IERC20(networkConfig.usdc).balanceOf(address(vault)),
            95 * 1e6
        );
        vm.stopPrank();
    }

    function testSupplyUSDCOnCompound() public {
        vm.startPrank(owner);
        vault.lendERC20("compound", networkConfig.usdc, 10 * 1e6);
        assertGt(vault.getCompoundAccountData(), 0);
        SafeVault.Investment memory userBalance = vault.getUserStruct(
            networkConfig.usdc
        );
        assertEq(userBalance.balanceInvestedInCompound, 10 * 1e6);
        assertEq(userBalance.balanceUnderlying, 90 * 1e6);
        vm.stopPrank();
    }

    function testWithdrawUSDCFromCompound() public {
        vm.startPrank(owner);
        vault.lendERC20("compound", networkConfig.usdc, 10 * 1e6);
        uint256 amountWithdrawn = vault.withdrawLentERC20(
            "compound",
            networkConfig.usdc,
            5 * 1e6
        );
        assertEq(amountWithdrawn, 5 * 1e6);
        SafeVault.Investment memory userBalance = vault.getUserStruct(
            networkConfig.usdc
        );
        assertEq(userBalance.balanceUnderlying, 95 * 1e6);
        assertEq(userBalance.balanceInvestedInCompound, 5 * 1e6);
        vm.stopPrank();
    }

    function testAddLiquidityToUniswap() public {
        vm.startPrank(owner);
        vault.supplyTokenPairToLPProtocol(
            "uniswap",
            networkConfig.weth,
            networkConfig.usdc,
            10 * 1e6,
            10 * 1e6,
            3000,
            TickMath.MIN_TICK,
            TickMath.MAX_TICK
        );

        vm.stopPrank();
    }
}
