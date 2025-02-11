// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {SafeVaultDeployer} from "../../src/SafeVaultDeployer.sol";
import {SafeVault} from "../../src/SafeVault.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IUniswapV3Factory} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";

contract LiquidityManagerTest is Test {
    SafeVaultDeployer public vaultDeployer;
    SafeVault public vault;
    HelperConfig public helperConfig;
    HelperConfig.NetworkConfig public networkConfig;
    address owner = address(1);
    uint256 sepoliaFork;
    uint256 fork;
    string ETH_SEPOLIA_RPC_URL = vm.envString("ETH_SEPOLIA_RPC_URL");
    string BASE_SEPOLIA_RPC_URL_2 = vm.envString("BASE_SEPOLIA_RPC_URL_2");
    string ARBITRUM_SEPOLIA_RPC_URL = vm.envString("ARBITRUM_SEPOLIA_RPC_URL");

    // /// @dev Tests constants.
    // uint24 constant FEE_TIER = 3000;
    // int24 constant TICK_SPACING = 60;
    // uint256 constant SMALL_SWAP_AMOUNT = 10 * 1e6; /// @dev 10 USDC (6 decimals)

    // /// @dev Known Uniswap V3 USDC/WETH pool address on Base Sepolia.
    // address public constant USDC_WETH_POOL =
    //     0x94bfc0574FF48E92cE43d495376C477B1d0EEeC0;

    function setUp() public {
        helperConfig = new HelperConfig();
        networkConfig = helperConfig.getArbitrumSepoliaConfig();
        fork = vm.createSelectFork(ARBITRUM_SEPOLIA_RPC_URL);
        vm.startPrank(owner);
        vaultDeployer = new SafeVaultDeployer();
        address _vault = vaultDeployer.deployVault(owner);
        vault = SafeVault(_vault);

        // Whitelist the agent address
        vault.addWhitelistedAddress(networkConfig.agent);

        deal(networkConfig.usdc, owner, 100 * 1e6);
        IERC20(networkConfig.usdc).approve(address(vault), 100 * 1e6);
        vault.depositERC20intoVault(networkConfig.usdc, 100 * 1e6);
        vm.stopPrank();

        // // Fund the vault with USDC and WETH for testing
        // deal(networkConfig.usdc, networkConfig.vault, 100_000 * 1e6); // 100k USDC
        // deal(networkConfig.weth, networkConfig.vault, 10 ether);
    }

    // function testSwapOnUniswap() public {
    //     vm.startPrank(networkConfig.vault);

    //     uint256 amountIn = SMALL_SWAP_AMOUNT;
    //     uint256 amountOutMin = 0;
    //     uint256 deadline = block.timestamp + 15 minutes;

    //     // Verify pool exists and has liquidity
    //     address pool = IUniswapV3Factory(networkConfig.uniswapFactory).getPool(
    //         networkConfig.usdc,
    //         networkConfig.weth,
    //         FEE_TIER
    //     );
    //     require(pool != address(0), "Pool does not exist");

    //     (uint160 sqrtPriceX96, int24 tick, , , , , ) = IUniswapV3Pool(pool)
    //         .slot0();
    //     console.log("Pool sqrtPriceX96:", sqrtPriceX96);
    //     console.log("Pool tick:", tick);

    //     // Verify fee tier
    //     uint24 actualFee = IUniswapV3Pool(pool).fee();
    //     require(actualFee == FEE_TIER, "Incorrect fee tier");

    //     // Initial balances
    //     uint256 initialUsdcBalance = IERC20(networkConfig.usdc).balanceOf(
    //         networkConfig.vault
    //     );
    //     uint256 initialWethBalance = IERC20(networkConfig.weth).balanceOf(
    //         networkConfig.vault
    //     );

    //     // Approve the LiquidityManager to spend USDC
    //     IERC20(networkConfig.usdc).approve(address(supplyLiquidity), amountIn);

    //     // Execute swap
    //     uint256 amountOut = supplyLiquidity.swapOnUniswap(
    //         networkConfig.usdc,
    //         networkConfig.weth,
    //         amountIn,
    //         amountOutMin,
    //         FEE_TIER
    //     );

    //     // Final balances
    //     uint256 finalUsdcBalance = IERC20(networkConfig.usdc).balanceOf(
    //         networkConfig.vault
    //     );
    //     uint256 finalWethBalance = IERC20(networkConfig.weth).balanceOf(
    //         networkConfig.vault
    //     );

    //     // Assertions
    //     assertGt(amountOut, 0, "Swap should return non-zero amount");
    //     assertEq(
    //         initialUsdcBalance - finalUsdcBalance,
    //         amountIn,
    //         "Incorrect USDC deducted"
    //     );
    //     assertGt(
    //         finalWethBalance,
    //         initialWethBalance,
    //         "Vault should receive WETH"
    //     );

    //     vm.stopPrank();
    // }

    // function test_Revert_SwapOnUniswapInsufficientAllowance() public {
    //     vm.startPrank(networkConfig.vault);
    //     uint256 amountIn = 0; // 1 USDC

    //     // Don't approve USDC spending
    //     vm.expectRevert();
    //     supplyLiquidity.swapOnUniswap(
    //         networkConfig.usdc,
    //         networkConfig.weth,
    //         amountIn,
    //         0,
    //         FEE_TIER
    //     );
    //     vm.stopPrank();
    // }

    // function testAddLiquidityToPool() public {
    //     vm.startPrank(networkConfig.vault);
    //     uint256 amount0Desired = 1000000; // 1 USDC
    //     uint256 amount1Desired = 1 ether; // 1 WETH
    //     // Approve both tokens
    //     IERC20(networkConfig.usdc).approve(
    //         address(supplyLiquidity),
    //         amount0Desired
    //     );
    //     IERC20(networkConfig.weth).approve(
    //         address(supplyLiquidity),
    //         amount1Desired
    //     );
    //     // Use hardcoded ticks for testing
    //     // These values represent a common price range around the current price
    //     int24 tickLower = -887220; // Example lower tick
    //     int24 tickUpper = 887220; // Example upper tick
    //     // Add liquidity
    //     uint128 liquidity = supplyLiquidity.addLiquidityToPool(
    //         networkConfig.usdc,
    //         networkConfig.weth,
    //         amount0Desired,
    //         amount1Desired,
    //         FEE_TIER,
    //         tickLower,
    //         tickUpper
    //     );
    //     // Verify liquidity was added
    //     assertGt(liquidity, 0, "Should have added non-zero liquidity");
    //     vm.stopPrank();
    // }

    // function test_Revert_AddLiquidityToPoolInvalidRange() public {
    //     vm.startPrank(networkConfig.vault);
    //     uint256 amount0Desired = 1000000;
    //     uint256 amount1Desired = 1 ether;

    //     // Approve tokens
    //     IERC20(networkConfig.usdc).approve(
    //         address(supplyLiquidity),
    //         amount0Desired
    //     );
    //     IERC20(networkConfig.weth).approve(
    //         address(supplyLiquidity),
    //         amount1Desired
    //     );

    //     // Try to add liquidity with invalid tick range
    //     vm.expectRevert();
    //     supplyLiquidity.addLiquidityToPool(
    //         networkConfig.usdc,
    //         networkConfig.weth,
    //         amount0Desired,
    //         amount1Desired,
    //         FEE_TIER,
    //         0, // Invalid lower tick
    //         1 // Invalid upper tick
    //     );
    //     vm.stopPrank();
    // }

    function testSupplyUSDCOnAave() public {
        vm.startPrank(networkConfig.agent);
        vault.lendERC20("aave", networkConfig.usdc, 10 * 1e6);
        (uint256 totalCollateralBase,,,,,) = vault.getAaveAccountData();
        SafeVault.Investment memory userBalance = vault.getUserStruct(networkConfig.usdc);
        assertEq(userBalance.balanceInvestedInAave, 10 * 1e6);
        assertEq(userBalance.balanceUnderlying, 90 * 1e6);
        assertGt(totalCollateralBase, 0);
        assertEq(IERC20(networkConfig.aaveUsdc).balanceOf(address(vault)), 10 * 1e6);
        vm.stopPrank();
    }

    function testWithdrawUSDCFromAave() public {
        vm.startPrank(networkConfig.agent);
        vault.lendERC20("aave", networkConfig.usdc, 10 * 1e6);
        uint256 amountWithdrawn = vault.withdrawLentERC20("aave", networkConfig.usdc, 5 * 1e6);
        assertEq(amountWithdrawn, 5 * 1e6);
        (uint256 totalCollateralBase,,,,,) = vault.getAaveAccountData();
        assertGt(totalCollateralBase, 0);
        SafeVault.Investment memory userBalance = vault.getUserStruct(networkConfig.usdc);
        assertEq(userBalance.balanceUnderlying, 95 * 1e6);
        assertEq(IERC20(networkConfig.usdc).balanceOf(address(vault)), 95 * 1e6);
        vm.stopPrank();
    }

    function testSupplyUSDCOnCompound() public {
        vm.startPrank(networkConfig.agent);
        vault.lendERC20("compound", networkConfig.usdc, 10 * 1e6);
        assertGt(vault.getCompoundAccountData(), 0);
        SafeVault.Investment memory userBalance = vault.getUserStruct(networkConfig.usdc);
        assertEq(userBalance.balanceInvestedInCompound, 10 * 1e6);
        assertEq(userBalance.balanceUnderlying, 90 * 1e6);
        vm.stopPrank();
    }

    function testWithdrawUSDCFromCompound() public {
        vm.startPrank(networkConfig.agent);
        vault.lendERC20("compound", networkConfig.usdc, 10 * 1e6);
        uint256 amountWithdrawn = vault.withdrawLentERC20("compound", networkConfig.usdc, 5 * 1e6);
        assertEq(amountWithdrawn, 5 * 1e6);
        SafeVault.Investment memory userBalance = vault.getUserStruct(networkConfig.usdc);
        assertEq(userBalance.balanceUnderlying, 95 * 1e6);
        assertEq(userBalance.balanceInvestedInCompound, 5 * 1e6);
        vm.stopPrank();
    }
}
