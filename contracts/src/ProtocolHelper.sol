// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {IPool} from "@aave/v3-core/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CometMainInterface} from "./interfaces/CometMainInterface.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IUniswapV3Factory} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import {INonfungiblePositionManager} from "./interfaces/INonfungiblePositionManager.sol";
import {CrosschainManager} from "./superchain/CrosschainManager.sol";

// import {TickMath} from "./lib/TickMath.sol";
// import {LiquidityAmounts} from "./lib/LiquidityAmounts.sol";

/**
 * @title ProtocolHelper for Optimal AI
 * @author Optimal AI
 * @notice This contract is used to help the Optimal AI contract to interact with the lending and liquidity protocols.
 * @notice The protocols supported are Aave V3, Compound, Uniswap, Aerodrome.
 */
contract ProtocolHelper {
    /// @notice Compound USDC instance(cUSDCv3).
    CometMainInterface public cUSDC;

    /// @notice Aave V3 pool instance.
    IPool public aaveLiquidityPool;

    /// @notice Uniswap V3 router and factory instance
    ISwapRouter public immutable uniswapSwapRouter;
    IUniswapV3Factory public immutable uniswapPoolFactory;
    INonfungiblePositionManager public immutable nonfungiblePositionManager;
    CrossChainManager public crossChainManager;

    event TokensSwappedOnDoubleTokenDex(
        string protocol, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut
    );

    event LiquidityAddedOnDoubleTokenDex(
        string protocol, address token0, address token1, uint128 liquidity, uint256 amount0, uint256 amount1
    );

    event LiquidityBurnedOnDoubleTokenDex(
        string protocol, address token0, address token1, uint128 liquidity, uint256 amount0, uint256 amount1
    );

    event TokenLent(string protocol, address token, uint256 amount);

    event TokenWithdrawnFromSingleTokenDex(string protocol, address token, uint256 amount);

    error TokensNotApproved(string protocol);
    error WithdrawingMoreThanLent(string protocol);
    error PoolDoesNotExist(string protocol);

    constructor(
        address _aaveLiquidityPool,
        address _cUSDC,
        address _uniswapSwapRouter,
        address _uniswapPoolFactory,
        address _INonfungiblePositionManager,
        address _crossChainManager
    ) {
        aaveLiquidityPool = IPool(_aaveLiquidityPool);
        cUSDC = CometMainInterface(_cUSDC);
        uniswapSwapRouter = ISwapRouter(_uniswapSwapRouter);
        uniswapPoolFactory = IUniswapV3Factory(_uniswapPoolFactory);
        nonfungiblePositionManager = INonfungiblePositionManager(_INonfungiblePositionManager);
        crossChainManager = CrossChainManager(_crossChainManager);
    }

    /**
     * @notice Lend token on Aave V3 on another chain.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     * @param _chainId Chain ID of the destination chain.
     */
    function lendTokenOnAaveCrossChain(address _token, uint256 _amount, uint256 _chainId) internal {
        // Bridge tokens to the destination chain.
        crossChainManager.bridgeTokens(_token, _amount, address(this));

        // Encode the function call for lending on the destination chain.
        bytes memory data = abi.encodeWithSignature("lendTokenOnAave(address,uint256)", _token, _amount);

        // Send a cross-chain message to execute the lending function.
        crossChainManager.sendCrossChainMessage(address(this), data);
    }

    /**
     * @notice Lend token on Compound on another chain.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     * @param _chainId Chain ID of the destination chain.
     */
    function lendTokenOnCompoundCrossChain(address _token, uint256 _amount, uint256 _chainId) internal {
        // Bridge tokens to the destination chain.
        crossChainManager.bridgeTokens(_token, _amount, address(this));

        // Encode the function call for lending on the destination chain.
        bytes memory data = abi.encodeWithSignature("lendTokenOnCompound(address,uint256)", _token, _amount);

        // Send a cross-chain message to execute the lending function.
        crossChainManager.sendCrossChainMessage(address(this), data);
    }

    /**
     * @notice Lend token on Aave V3.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     */
    function lendTokenOnAave(address _token, uint256 _amount) internal {
        bool approvedAaveTokens = IERC20(_token).approve(address(aaveLiquidityPool), _amount);
        if (!approvedAaveTokens) {
            revert TokensNotApproved("aave");
        }
        aaveLiquidityPool.supply(_token, _amount, address(this), 0);
        emit TokenLent("Aave", _token, _amount);
    }

    /**
     * @notice Lend token on Compound.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     */
    function lendTokenOnCompound(address _token, uint256 _amount) internal {
        bool approvedCompound = IERC20(_token).approve(address(cUSDC), _amount);
        if (!approvedCompound) {
            revert TokensNotApproved("compound");
        }
        cUSDC.supplyTo(address(this), _token, _amount);
        emit TokenLent("Compound", _token, _amount);
    }

    /**
     * @notice Withdraw lent tokens on Aave V3.
     * @notice User should have enough lent tokens on aave to withdraw.
     * @param _token Token to withdraw.
     * @param _amount Amount of token to withdraw.
     */
    function withdrawLentTokensOnAave(address _token, uint256 _amount) internal returns (uint256 amountWithdrawn) {
        (uint256 collateral,,,,,) = getAaveAccountData();
        if (collateral < _amount) {
            revert WithdrawingMoreThanLent("aave");
        }
        amountWithdrawn = aaveLiquidityPool.withdraw(_token, _amount, address(this));
        emit TokenWithdrawnFromSingleTokenDex("Aave", _token, _amount);
    }

    /**
     * @notice Withdraw lent tokens on Compound.
     * @notice User should have enough lent tokens on compound to withdraw.
     * @param _token Token to withdraw.
     * @param _amount Amount of token to withdraw.
     */
    function withdrawLentTokensOnCompound(address _token, uint256 _amount) internal returns (uint256 amountWithdrawn) {
        uint256 collateral = getCompoundAccountData();
        if (collateral < _amount) {
            revert WithdrawingMoreThanLent("compound");
        }
        uint256 collateralBefore = IERC20(_token).balanceOf(address(this));
        cUSDC.withdraw(_token, _amount);
        uint256 collateralAfter = IERC20(_token).balanceOf(address(this));
        amountWithdrawn = collateralAfter - collateralBefore;
        emit TokenWithdrawnFromSingleTokenDex("Compound", _token, amountWithdrawn);
    }

    /**
     * @notice Add liquidity to Uniswap V3 pool.
     * @notice Liquidity is to be added in token pair, that pool for that token must exist.
     * @param token0 First token in the pair.
     * @param token1 Second token in the pair.
     * @param amount0Desired Amount of token0 to add.
     * @param amount1Desired Amount of token1 to add.
     * @param fee Pool fee tier.
     * @param tickLower Lower tick.
     * @param tickUpper Upper tick.
     * @return tokenId Token ID of the liquidity position.
     * @return liquidity Amount of liquidity added.
     * @return amount0 Amount of token0 added.
     * @return amount1 Amount of token1 added.
     */
    function addLiquidityOnUniswap(
        address token0,
        address token1,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper
    ) internal returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) {
        /// @dev Get pool address.
        address pool = uniswapPoolFactory.getPool(token0, token1, fee);
        if (pool == address(0)) {
            revert PoolDoesNotExist("uniswap");
        }

        /// @dev Approve pool.
        IERC20(token0).approve(pool, amount0);
        IERC20(token1).approve(pool, amount1);

        /// @dev Get current pool price.
        (uint160 sqrtPriceX96,,,,,,) = IUniswapV3Pool(pool).slot0();

        /// @dev Calculate the liquidity.
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: token0,
            token1: token1,
            fee: fee,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: amount0Desired,
            amount1Min: amount1Desired,
            recipient: address(this),
            deadline: block.timestamp
        });

        /// @dev Add liquidity to pool using uniswap NonfungiblePositionManager.
        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(params);

        emit LiquidityAddedOnDoubleTokenDex("uniswap", token0, token1, liquidity, amount0, amount1);
    }

    /**
     * @notice Withdraw liquidity from Uniswap V3 pool
     * @param _tokenA First token in the pair
     * @param _tokenB Second token in the pair
     * @param _fee Pool fee tier
     * @param _liquidityToRemove Amount of liquidity to remove
     */
    function withdrawLiquidityFromUniswap(address _tokenA, address _tokenB, uint24 _fee, uint128 _liquidityToRemove)
        internal
        returns (uint256 amount0, uint256 amount1)
    {
        /// @dev Get pool address
        address pool = uniswapPoolFactory.getPool(_tokenA, _tokenB, _fee);
        if (pool == address(0)) {
            revert PoolDoesNotExist("uniswap");
        }

        /// @dev Sort tokens
        (address token0, address token1) = _tokenA < _tokenB ? (_tokenA, _tokenB) : (_tokenB, _tokenA);

        /// @dev Get current pool price and tick
        (uint160 sqrtPriceX96, int24 tick,,,,,) = IUniswapV3Pool(pool).slot0();

        /// @dev Determine tick range
        int24 tickLower = tick - 100;
        int24 tickUpper = tick + 100;

        /// @dev Burn liquidity
        (amount0, amount1) = IUniswapV3Pool(pool).burn(tickLower, tickUpper, _liquidityToRemove);

        /// @dev Collect tokens to vault
        IUniswapV3Pool(pool).collect(address(this), tickLower, tickUpper, uint128(amount0), uint128(amount1));

        emit LiquidityBurnedOnDoubleTokenDex("uniswap", token0, token1, _liquidityToRemove, amount0, amount1);
    }

    /**
     * @notice Swap tokens on Uniswap V3.
     * @param tokenIn Token to swap from.
     * @param tokenOut Token to swap to.
     * @param amountIn Amount of token to swap.
     * @param amountOutMin Minimum amount of token to receive.
     * @param fee Pool fee .
     */
    function executeSwapOnUniswap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, uint24 fee)
        internal
        returns (uint256 amountOut)
    {
        bool approvedTokens = IERC20(tokenIn).approve(address(uniswapSwapRouter), amountIn);
        if (!approvedTokens) {
            revert TokensNotApproved("uniswap");
        }

        /// @dev Execute swap.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: 0
        });

        amountOut = uniswapSwapRouter.exactInputSingle(params);
        emit TokensSwappedOnDoubleTokenDex("uniswap", tokenIn, tokenOut, amountIn, amountOut);
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
    function getAaveAccountData()
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
        return aaveLiquidityPool.getUserAccountData(address(this));
    }

    /**
     * @notice Get the user's compound liquidity status.
     * @return balance The user's compound liquidity balance.
     */
    function getCompoundAccountData() public view returns (uint256 balance) {
        balance = cUSDC.balanceOf(address(this));
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
    function getUniswapLiquidityPositionDetails(address _tokenA, address _tokenB, uint24 _fee)
        public
        view
        returns (uint128 liquidity, uint256 amount0, uint256 amount1)
    {
        /// @dev Get pool address
        address pool = uniswapPoolFactory.getPool(_tokenA, _tokenB, _fee);
        if (pool == address(0)) {
            revert PoolDoesNotExist("uniswap");
        }

        /// @dev Sort tokens
        (address token0, address token1) = _tokenA < _tokenB ? (_tokenA, _tokenB) : (_tokenB, _tokenA);

        /// @dev Get current pool price and tick
        (uint160 sqrtPriceX96, int24 tick,,,,,) = IUniswapV3Pool(pool).slot0();

        /// @dev Determine tick range
        int24 tickLower = tick - 100;
        int24 tickUpper = tick + 100;

        /// @dev Destructure only the first three values
        (liquidity, amount0, amount1,,) =
            IUniswapV3Pool(pool).positions(keccak256(abi.encodePacked(address(this), tickLower, tickUpper)));

        return (liquidity, amount0, amount1);
    }
}
