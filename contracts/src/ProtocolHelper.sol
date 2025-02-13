// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {IPool} from "@aave/v3-core/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CometMainInterface} from "./interfaces/CometMainInterface.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IUniswapV3Factory} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import {INonfungiblePositionManager} from "./interfaces/INonfungiblePositionManager.sol";
import {CrossChainManager} from "./superchain/CrosschainManager.sol";
import {LiquidityAmounts} from "./lib/LiquidityAmounts.sol";
import {TickMath} from "./lib/TickMath.sol";

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
    INonfungiblePositionManager public immutable nonFungiblePositionManager;

    CrossChainManager public crossChainManager;

    event TokensSwappedOnDoubleTokenDex(
        string protocol,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event LiquidityAddedOnDoubleTokenDex(
        string protocol,
        address token0,
        address token1,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    event LiquidityBurnedOnDoubleTokenDex(
        string protocol,
        uint256 tokenId,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    event TokenLent(string protocol, address token, uint256 amount);

    event TokenWithdrawnFromSingleTokenDex(
        string protocol,
        address token,
        uint256 amount
    );

    event TokensCollected(
        string protocol,
        uint256 tokenId,
        uint256 amount0,
        uint256 amount1
    );

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
        nonFungiblePositionManager = INonfungiblePositionManager(
            _INonfungiblePositionManager
        );
        crossChainManager = CrossChainManager(_crossChainManager);
    }

    /**
     * @notice Lend token on Aave V3 on another chain.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     * @param _chainId Chain ID of the destination chain.
     */
    function _lendTokenOnAaveCrossChain(
        address _token,
        uint256 _amount,
        uint256 _chainId
    ) internal {
        /// @dev Bridge tokens to the destination chain.
        crossChainManager.bridgeTokens(_token, _amount, address(this));

        /// @dev Encode the function call for lending on the destination chain.
        bytes memory data = abi.encodeWithSignature(
            "lendTokenOnAave(address,uint256)",
            _token,
            _amount
        );

        /// @dev Send a cross-chain message to execute the lending function.
        crossChainManager.sendCrossChainMessage(address(this), data);
    }

    /**
     * @notice Lend token on Compound on another chain.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     * @param _chainId Chain ID of the destination chain.
     */
    function _lendTokenOnCompoundCrossChain(
        address _token,
        uint256 _amount,
        uint256 _chainId
    ) internal {
        /// @dev Bridge tokens to the destination chain.
        crossChainManager.bridgeTokens(_token, _amount, address(this));

        /// @dev Encode the function call for lending on the destination chain.
        bytes memory data = abi.encodeWithSignature(
            "lendTokenOnCompound(address,uint256)",
            _token,
            _amount
        );

        /// @dev Send a cross-chain message to execute the lending function.
        crossChainManager.sendCrossChainMessage(address(this), data);
    }

    /**
     * @notice Lend token on Aave V3.
     * @param _token Token to lend.
     * @param _amount Amount of token to lend.
     */
    function _lendTokenOnAave(address _token, uint256 _amount) internal {
        bool approvedAaveTokens = IERC20(_token).approve(
            address(aaveLiquidityPool),
            _amount
        );
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
    function _lendTokenOnCompound(address _token, uint256 _amount) internal {
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
    function _withdrawLentTokensOnAave(
        address _token,
        uint256 _amount
    ) internal returns (uint256 amountWithdrawn) {
        (uint256 collateral, , , , , ) = getAaveAccountData();
        if (collateral < _amount) {
            revert WithdrawingMoreThanLent("aave");
        }
        amountWithdrawn = aaveLiquidityPool.withdraw(
            _token,
            _amount,
            address(this)
        );
        emit TokenWithdrawnFromSingleTokenDex("Aave", _token, _amount);
    }

    /**
     * @notice Withdraw lent tokens on Compound.
     * @notice User should have enough lent tokens on compound to withdraw.
     * @param _token Token to withdraw.
     * @param _amount Amount of token to withdraw.
     */
    function _withdrawLentTokensOnCompound(
        address _token,
        uint256 _amount
    ) internal returns (uint256 amountWithdrawn) {
        uint256 collateral = getCompoundAccountData();
        if (collateral < _amount) {
            revert WithdrawingMoreThanLent("compound");
        }
        uint256 collateralBefore = IERC20(_token).balanceOf(address(this));
        cUSDC.withdraw(_token, _amount);
        uint256 collateralAfter = IERC20(_token).balanceOf(address(this));
        amountWithdrawn = collateralAfter - collateralBefore;
        emit TokenWithdrawnFromSingleTokenDex(
            "Compound",
            _token,
            amountWithdrawn
        );
    }

    /**
     * @notice Internal Function to mint a new position on Uniswap V3.
     * @notice If the user has a position already, call _increaseLiquidityOnUniswap.
     * @param _tokenA First token in the pair.
     * @param _tokenB Second token in the pair.
     * @param _fee Pool fee tier.
     * @param _amount0 Amount of tokenA to add.
     * @param _amount1 Amount of tokenB to add.
     * @param _tickLower Lower tick bound for the liquidity position.
     * @param _tickUpper Upper tick bound for the liquidity position.
     * @return tokenId Token ID of the position.
     * @return liquidity Liquidity of the position.
     * @return amount0 Amount of tokenA in the position.
     * @return amount1 Amount of tokenB in the position.
     */
    function _mintNewPositionOnUniswap(
        address _tokenA,
        address _tokenB,
        uint24 _fee,
        uint256 _amount0,
        uint256 _amount1,
        int24 _tickLower,
        int24 _tickUpper
    )
        internal
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        /// @dev Check if the pool exists
        address pool = uniswapPoolFactory.getPool(_tokenA, _tokenB, _fee);
        if (pool == address(0)) {
            revert PoolDoesNotExist("uniswap");
        }
        /// @dev Approve the pool to spend tokens
        IERC20(_tokenA).approve(address(nonFungiblePositionManager), _amount0);
        IERC20(_tokenB).approve(address(nonFungiblePositionManager), _amount1);

        /// @dev Calculate the liquidity
        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: _tokenA,
                token1: _tokenB,
                fee: _fee,
                tickLower: _tickLower,
                tickUpper: _tickUpper,
                amount0Desired: _amount0,
                amount1Desired: _amount1,
                amount0Min: _amount0,
                amount1Min: _amount1,
                recipient: address(this),
                deadline: block.timestamp
            });

        /// @dev Mint a new liquidity position and update user's position id
        (tokenId, liquidity, amount0, amount1) = nonFungiblePositionManager
            .mint(params);

        emit LiquidityAddedOnDoubleTokenDex(
            "uniswap",
            _tokenA,
            _tokenB,
            liquidity,
            amount0,
            amount1
        );
    }

    /**
     * @notice Internal Function to add liquidity to an existing position on Uniswap V3.
     * @param _tokenA First token in the pair.
     * @param _tokenB Second token in the pair.
     * @param _tokenId Token ID of the position.
     * @param _amount0 Amount of tokenA to add.
     * @param _amount1 Amount of tokenB to add.
     * @return liquidity Liquidity of the position.
     * @return amount0 Amount of tokenA in the position.
     * @return amount1 Amount of tokenB in the position.
     */
    function _increaseLiquidityToExistingPosition(
        address _tokenA,
        address _tokenB,
        uint256 _tokenId,
        uint256 _amount0,
        uint256 _amount1
    ) internal returns (uint128 liquidity, uint256 amount0, uint256 amount1) {
        /// @dev Approve the pool to spend tokens.
        IERC20(_tokenA).approve(address(nonFungiblePositionManager), _amount0);
        IERC20(_tokenB).approve(address(nonFungiblePositionManager), _amount1);

        /// @dev Prepare increaseLiquidity params.
        INonfungiblePositionManager.IncreaseLiquidityParams
            memory increaseLiquidityParams = INonfungiblePositionManager
                .IncreaseLiquidityParams({
                    tokenId: _tokenId,
                    amount0Desired: _amount0,
                    amount1Desired: _amount1,
                    amount0Min: _amount0,
                    amount1Min: _amount1,
                    deadline: block.timestamp
                });

        /// @dev Increase liquidity to the existing position.
        (liquidity, amount0, amount1) = nonFungiblePositionManager
            .increaseLiquidity(increaseLiquidityParams);

        emit LiquidityAddedOnDoubleTokenDex(
            "uniswap",
            _tokenA,
            _tokenB,
            liquidity,
            amount0,
            amount1
        );
    }

    /**
     * @notice Internal Function to decrease liquidity from an existing position on Uniswap V3.
     * @param _tokenId Token ID of the position.
     * @param _liquidity Liquidity to decrease.
     * @param _amount0Min Minimum amount of tokenA to decrease.
     * @param _amount1Min Minimum amount of tokenB to decrease.
     * @return amount0Decreased Amount of tokenA decreased.
     * @return amount1Decreased Amount of tokenB decreased.
     */
    function _decreaseLiquidityFromUniswap(
        uint256 _tokenId,
        uint128 _liquidity,
        uint256 _amount0Min,
        uint256 _amount1Min
    ) internal returns (uint256 amount0Decreased, uint256 amount1Decreased) {
        /// @dev Call getter and return current user holdings.
        (
            ,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,
            ,
            uint256 amount0,
            uint256 amount1
        ) = getUserPositionInPool(_tokenId);
        require(
            liquidity >= _liquidity,
            "Not enough liquidity to decrease, try adding liquidity first"
        );
        require(
            amount0 >= _amount0Min,
            "Not enough tokenA to decrease, try adding more tokenA"
        );
        require(
            amount1 >= _amount1Min,
            "Not enough tokenB to decrease, try adding more tokenB"
        );
        /// @dev Prepare decreaseLiquidity params.
        INonfungiblePositionManager.DecreaseLiquidityParams
            memory decreaseParams = INonfungiblePositionManager
                .DecreaseLiquidityParams({
                    tokenId: _tokenId,
                    liquidity: _liquidity,
                    amount0Min: _amount0Min,
                    amount1Min: _amount1Min,
                    deadline: block.timestamp
                });

        /// @dev Decrease liquidity from the existing position.
        (amount0Decreased, amount1Decreased) = nonFungiblePositionManager
            .decreaseLiquidity(decreaseParams);

        emit LiquidityBurnedOnDoubleTokenDex(
            "uniswap",
            _tokenId,
            _liquidity,
            amount0Decreased,
            amount1Decreased
        );
    }

    /**
     * @notice Internal Function to collect tokens from an existing position.
     * @param _tokenId Token ID of the position.
     * @return amount0Collected Amount of tokenA collected.
     * @return amount1Collected Amount of tokenB collected.
     */
    function _collectTokensFromPosition(
        uint256 _tokenId
    ) internal returns (uint256 amount0Collected, uint256 amount1Collected) {
        /// @dev Prepare collect params.
        INonfungiblePositionManager.CollectParams
            memory collectParams = INonfungiblePositionManager.CollectParams({
                tokenId: _tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        /// @dev Collect tokens (including fees) from the position and transfer to user.
        (amount0Collected, amount1Collected) = nonFungiblePositionManager
            .collect(collectParams);

        emit TokensCollected(
            "uniswap",
            _tokenId,
            amount0Collected,
            amount1Collected
        );
    }

    /**
     * @notice Swap tokens on Uniswap V3.
     * @param tokenIn Token to swap from.
     * @param tokenOut Token to swap to.
     * @param amountIn Amount of token to swap.
     * @param amountOutMin Minimum amount of token to receive.
     * @param fee Pool fee .
     */
    function _executeSwapOnUniswap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint24 fee
    ) internal returns (uint256 amountOut) {
        bool approvedTokens = IERC20(tokenIn).approve(
            address(uniswapSwapRouter),
            amountIn
        );
        if (!approvedTokens) {
            revert TokensNotApproved("uniswap");
        }

        /// @dev Execute swap.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
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
        emit TokensSwappedOnDoubleTokenDex(
            "uniswap",
            tokenIn,
            tokenOut,
            amountIn,
            amountOut
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

    function getUserPositionInPool(
        uint256 _tokenId
    )
        public
        view
        returns (
            address operator,
            address token0,
            address token1,
            uint24 fee,
            uint128 liquidity,
            int24 tickLower,
            int24 tickUpper,
            uint128 tokensOwed0,
            uint128 tokensOwed1,
            uint256 amount0,
            uint256 amount1
        )
    {
        (
            ,
            operator,
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            liquidity,
            ,
            ,
            tokensOwed0,
            tokensOwed1
        ) = nonFungiblePositionManager.positions(_tokenId);
        (amount0, amount1) = getAmountsForLiquidityHelper(
            fee,
            tickLower,
            tickUpper,
            liquidity
        );
    }

    /**
     * @notice Internal Function to get the amount of tokenA and tokenB in a user's position.
     * @param fee Fee tier for the pool.
     * @param tickLower Lower tick bound for the liquidity position.
     * @param tickUpper Upper tick bound for the liquidity position.
     * @param liquidity Liquidity in the position.
     * @return amount0 Amount of tokenA in the position.
     * @return amount1 Amount of tokenB in the position.
     */
    function getAmountsForLiquidityHelper(
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity
    ) public pure returns (uint256 amount0, uint256 amount1) {
        uint160 sqrtPriceX96 = TickMath.getSqrtRatioAtTick(int24(fee));
        uint160 sqrtPriceAX96 = TickMath.getSqrtRatioAtTick(tickLower);
        uint160 sqrtPriceBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
        (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
            sqrtPriceX96,
            sqrtPriceAX96,
            sqrtPriceBX96,
            liquidity
        );
    }
}
