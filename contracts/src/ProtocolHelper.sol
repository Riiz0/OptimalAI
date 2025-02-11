// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {IPool} from "@aave/v3-core/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CometMainInterface} from "./interfaces/CometMainInterface.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IUniswapV3Factory} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import {TickMath} from "./lib/TickMath.sol";
import {LiquidityAmounts} from "./lib/LiquidityAmounts.sol";

/**
 * @title LiquidityManager
 * @author Cento-AI
 * @notice Contract that integrates with aave and compound protocols to supply and withdraw liquidity.
 * @notice Contract to handle token swaps and liquidity additions on Uniswap.
 * @notice This contract is inherited by the Cento-AI Vault contract.
 * @notice This contract can only be used by the Cento-AI Vault contract.
 * @dev Integrates with a vault to manage user funds for swaps and liquidity.
 * @dev For compound finance, only USDC investment is available for now.
 */
contract LiquidityManager {
    /// @notice Aave V3 components
    IPool public aavePool;

    /// @notice Compound components
    CometMainInterface public compoundUsdc;

    /// @notice Uniswap V3 components
    ISwapRouter public immutable uniswapRouter;
    IUniswapV3Factory public immutable uniswapFactory;

    /// @notice Uniswap V3 events
    event TokensSwapped(
        address indexed protocol,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    /// @notice For two token(uniswap)
    event LiquidityAdded(
        address indexed pool,
        address token0,
        address token1,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    /// @notice For two token(uniswap)
    event LiquidityRemoved(
        address indexed pool,
        address token0,
        address token1,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    /// @notice For single token(aave, compound)
    event LiquiditySupplied(string protocol, address asset, uint256 amount);

    /// @notice For single token(aave, compound)
    event LiquidityWithdrawn(string protocol, address asset, uint256 amount);

    /**
     * @param _aavePool Aave V3 pool address.
     * @param _compoundUsdc Compound USDC address.(Currently only USDC supported for compound).
     * @param _uniswapRouter Uniswap V3 router address.
     * @param _uniswapFactory Uniswap V3 factory address.
     * @dev Constructor to set the addresses of the Aave pool, Compound USDC, Uniswap router, Uniswap factory, and vault.
     */
    constructor(
        address _aavePool,
        address _compoundUsdc,
        address _uniswapRouter,
        address _uniswapFactory
    ) {
        aavePool = IPool(_aavePool);
        compoundUsdc = CometMainInterface(_compoundUsdc);
        uniswapRouter = ISwapRouter(_uniswapRouter);
        uniswapFactory = IUniswapV3Factory(_uniswapFactory);
    }

    /**
     * @notice Supply liquidity on Aave V3(single token).
     * @param _asset Asset to supply liquidity on.
     * @param _amount Amount of asset to supply.
     */
    function supplyLiquidityOnAave(address _asset, uint256 _amount) internal {
        bool approvedAave = IERC20(_asset).approve(address(aavePool), _amount);
        require(approvedAave, "Approval of asset into Aave pool failed");
        aavePool.supply(_asset, _amount, address(this), 0);
        emit LiquiditySupplied("Aave", _asset, _amount);
    }

    /**
     * @notice Supply liquidity on Compound(single token).
     * @param _asset Asset to supply liquidity on.
     * @param _amount Amount of asset to supply.
     */
    function supplyLiquidityOnCompound(
        address _asset,
        uint256 _amount
    ) internal {
        bool approvedCompound = IERC20(_asset).approve(
            address(compoundUsdc),
            _amount
        );
        require(approvedCompound, "Approval of asset into Compound failed");
        compoundUsdc.supplyTo(address(this), _asset, _amount);
        emit LiquiditySupplied("Compound", _asset, _amount);
    }

    /**
     * @notice Withdraw liquidity from Aave V3(single token).
     * @param _asset Asset to withdraw liquidity from.
     * @param _amount Amount of asset to withdraw.
     * @return amountWithdrawn Amount of asset withdrawn.
     */
    function withdrawLiquidityFromAave(
        address _asset,
        uint256 _amount
    ) internal returns (uint256 amountWithdrawn) {
        (uint256 collateral, , , , , ) = getAaveLiquidityStatus();
        require(collateral >= _amount, "Cannot withdraw more than borrowed");
        amountWithdrawn = aavePool.withdraw(_asset, _amount, address(this));
        emit LiquidityWithdrawn("Aave", _asset, _amount);
    }

    /**
     * @notice Withdraw liquidity from Compound(single token).
     * @param _asset Asset to withdraw liquidity from.
     * @param _amount Amount of asset to withdraw.
     * @return amountWithdrawn Amount of asset withdrawn.
     */
    function withdrawLiquidityFromCompound(
        address _asset,
        uint256 _amount
    ) internal returns (uint256 amountWithdrawn) {
        uint256 collateral = getCompoundLiquidityStatus();
        require(collateral >= _amount, "Cannot withdraw more than borrowed");
        uint256 collateralBefore = IERC20(_asset).balanceOf(address(this));
        compoundUsdc.withdraw(_asset, _amount);
        uint256 collateralAfter = IERC20(_asset).balanceOf(address(this));
        amountWithdrawn = collateralAfter - collateralBefore;
        emit LiquidityWithdrawn("Compound", _asset, amountWithdrawn);
    }

    /**
     * @notice Swap tokens on Uniswap.
     * @param tokenIn token to swap from.
     * @param tokenOut token to swap to.
     * @param amountIn amount of tokenIn to swap.
     * @param amountOutMin minimum amount of tokenOut to receive.
     * @param fee fee tier for the swap.
     * @return amountOut amount of tokenOut received.
     */
    function swapOnUniswap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint24 fee
    ) internal returns (uint256 amountOut) {
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);

        /// @dev Execute swap.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(this),
                /// @dev Output to vault
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        amountOut = uniswapRouter.exactInputSingle(params);
        emit TokensSwapped(
            address(uniswapRouter),
            tokenIn,
            tokenOut,
            amountIn,
            amountOut
        );
    }

    /**
     * @notice Add liquidity directly to a Uniswap V3 pool (two token).
     * @param tokenA First token in pair
     * @param tokenB Second token in pair
     * @param amountADesired Max amount of tokenA to add
     * @param amountBDesired Max amount of tokenB to add
     * @param fee Pool fee tier (e.g., 3000 = 0.3%)
     * @param tickLower Lower tick boundary
     * @param tickUpper Upper tick boundary
     */
    function supplyLiquidityOnUniswap(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper
    ) internal returns (uint128 liquidity) {
        /// @dev Get pool address.
        address pool = uniswapFactory.getPool(tokenA, tokenB, fee);
        require(pool != address(0), "Pool doesn't exist");

        /// @dev Sort tokens.
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);

        /// @dev Transfer tokens from vault.
        uint256 amount0 = tokenA == token0 ? amountADesired : amountBDesired;
        uint256 amount1 = tokenA == token0 ? amountBDesired : amountADesired;

        /// @dev Approve pool.
        IERC20(token0).approve(pool, amount0);
        IERC20(token1).approve(pool, amount1);

        /// @dev Get current pool price.
        (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(pool).slot0();

        /// @dev Calculate liquidity using Uniswap libraries.
        uint160 sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
        uint160 sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
        liquidity = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            sqrtRatioAX96,
            sqrtRatioBX96,
            amount0,
            amount1
        );

        /// @dev Add liquidity directly to pool.
        (uint256 amount0Actual, uint256 amount1Actual) = IUniswapV3Pool(pool)
            .mint(
                address(this),
                /// @dev Recipient (this contract)
                tickLower,
                tickUpper,
                liquidity,
                abi.encode(address(this))
            );
        /// @dev Callback data

        emit LiquidityAdded(
            pool,
            token0,
            token1,
            liquidity,
            amount0Actual,
            amount1Actual
        );
    }

    /**
     * @notice Withdraw liquidity from Uniswap V3 pool
     * @param _tokenA First token in the pair
     * @param _tokenB Second token in the pair
     * @param _fee Pool fee tier
     * @param _liquidityToRemove Amount of liquidity to remove
     */
    function withdrawLiquidityFromUniswap(
        address _tokenA,
        address _tokenB,
        uint24 _fee,
        uint128 _liquidityToRemove
    ) internal {
        /// @dev Get pool address
        address pool = uniswapFactory.getPool(_tokenA, _tokenB, _fee);
        require(pool != address(0), "Pool doesn't exist");

        /// @dev Sort tokens
        (address token0, address token1) = _tokenA < _tokenB
            ? (_tokenA, _tokenB)
            : (_tokenB, _tokenA);

        /// @dev Get current pool price and tick
        (uint160 sqrtPriceX96, int24 tick, , , , , ) = IUniswapV3Pool(pool)
            .slot0();

        /// @dev Determine tick range
        int24 tickLower = tick - 100;
        int24 tickUpper = tick + 100;

        /// @dev Burn liquidity
        (uint256 amount0, uint256 amount1) = IUniswapV3Pool(pool).burn(
            tickLower,
            tickUpper,
            _liquidityToRemove
        );

        /// @dev Collect tokens to vault
        IUniswapV3Pool(pool).collect(
            address(this),
            tickLower,
            tickUpper,
            uint128(amount0),
            uint128(amount1)
        );

        emit LiquidityRemoved(
            pool,
            token0,
            token1,
            _liquidityToRemove,
            amount0,
            amount1
        );
    }

    /**
     * @notice Returns the user account data across all the reserves
     * @return totalCollateralBase The total collateral of the user in the base currency used by the price feed
     * @return totalDebtBase The total debt of the user in the base currency used by the price feed
     * @return availableBorrowsBase The borrowing power left of the user in the base currency used by the price feed
     * @return currentLiquidationThreshold The liquidation threshold of the user
     * @return ltv The loan to value of The user
     * @return healthFactor The current health factor of the user
     */
    function getAaveLiquidityStatus()
        public
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return aavePool.getUserAccountData(address(this));
    }

    /**
     * @notice Get the user's compound liquidity status.
     * @return balance The user's compound liquidity balance.
     */
    function getCompoundLiquidityStatus()
        public
        view
        returns (uint256 balance)
    {
        balance = compoundUsdc.balanceOf(address(this));
    }

    /**
     * @notice Get Uniswap V3 liquidity position details
     * @param _tokenA First token in the pair
     * @param _tokenB Second token in the pair
     * @param _fee Pool fee tier
     * @return liquidity Current liquidity in the pool
     * @return amount0 Current amount of token0 in the position
     * @return amount1 Current amount of token1 in the position
     */
    function getUniswapLiquidityStatus(
        address _tokenA,
        address _tokenB,
        uint24 _fee
    )
        public
        view
        returns (uint128 liquidity, uint256 amount0, uint256 amount1)
    {
        /// @dev Get pool address
        address pool = uniswapFactory.getPool(_tokenA, _tokenB, _fee);
        require(pool != address(0), "Pool doesn't exist");

        /// @dev Sort tokens
        (address token0, address token1) = _tokenA < _tokenB
            ? (_tokenA, _tokenB)
            : (_tokenB, _tokenA);

        /// @dev Get current pool price and tick
        (uint160 sqrtPriceX96, int24 tick, , , , , ) = IUniswapV3Pool(pool)
            .slot0();

        /// @dev Determine tick range
        int24 tickLower = tick - 100;
        int24 tickUpper = tick + 100;

        /// @dev Destructure only the first three values
        (liquidity, amount0, amount1, , ) = IUniswapV3Pool(pool).positions(
            keccak256(abi.encodePacked(address(this), tickLower, tickUpper))
        );

        return (liquidity, amount0, amount1);
    }
}
