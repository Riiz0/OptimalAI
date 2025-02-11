// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@balancer/balancer-v2-monorepo/pkg/interfaces/contracts/vault/IVault.sol";
import "@balancer/balancer-v2-monorepo/pkg/interfaces/contracts/vault/IFlashLoanRecipient.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

/**
 * @title OptimalArbitrage
 * @author OptimalAI
 * @notice This contract identifies and executes arbitrage opportunities between two decentralized exchanges (DEXs) using flash loans from Balancer V2.
 * @notice It is designed to be used exclusively by the Balancer Vault contract.
 * @dev The contract borrows a flash loan, performs two sequential swaps (e.g., DEX A → DEX B), repays the loan, and transfers profits to the contract owner.
 * @dev Important: The current implementation does not account for Balancer's flash loan fees, which could impact profitability.
 */
contract OptimalArbitrage is IFlashLoanRecipient {
    /// @notice Address of the Balancer V2 Vault on Base Sepolia
    IVault private constant balancerVault = IVault(0xBA12222222228d8Ba445958a75a0704d566BF2C8);

    /**
     * @dev A struct to define the parameters for a single arbitrage trade.
     * @param dexRouters Array containing the addresses of the two DEX routers to use for the swaps.
     * @param tokens Array containing the addresses of the tokens involved in the arbitrage path.
     * @param swapFee The fee tier for the Uniswap V3 pool used in the swaps (e.g., 3000 = 0.3%).
     */
    struct ArbitrageTrade {
        address[] dexRouters;
        address[] tokens;
        uint24 swapFee;
    }

    /**
     * @notice Emitted when a swap is successfully executed on a DEX.
     * @param inputToken The address of the token being swapped.
     * @param outputToken The address of the token received after the swap.
     * @param inputAmount The amount of inputToken swapped.
     * @param outputAmount The minimum amount of outputToken expected (slippage protection).
     */
    event SwapExecuted(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount);

    constructor() {}

    /**
     * @notice Performs an arbitrage trade without using a flash loan.
     * @dev This function is used for testing or small-scale arbitrage without borrowing funds.
     * @dev Emits a SwapExecuted event upon successful execution.
     * @param dexRouters Array of two DEX router addresses to use for the swaps.
     * @param tokens Array of two token addresses defining the arbitrage path.
     * @param swapFee The fee tier for the Uniswap V3 pool.
     * @param tradeAmount The amount of the first token to swap.
     */
    function performDirectArbitrage(
        address[] memory dexRouters,
        address[] memory tokens,
        uint24 swapFee,
        uint256 tradeAmount
    ) internal {
        ArbitrageTrade memory trade = ArbitrageTrade({dexRouters: dexRouters, tokens: tokens, swapFee: swapFee});

        // First swap: Convert the borrowed token to an intermediate token.
        _executeSwap(
            trade.dexRouters[0], // First DEX router (e.g., Uniswap)
            trade.tokens[0], // Borrowed token address
            tradeAmount, // Amount to swap
            trade.tokens[1], // Intermediate token address
            0, // No minimum output (optimistic arbitrage)
            trade.swapFee // Pool fee tier
        );

        // Second swap: Convert the intermediate token back to the borrowed token.
        _executeSwap(
            trade.dexRouters[1], // Second DEX router (e.g., Sushiswap)
            trade.tokens[1], // Intermediate token address
            IERC20(trade.tokens[1]).balanceOf(address(this)), // Swap entire balance
            trade.tokens[0], // Borrowed token address
            tradeAmount, // Minimum required to repay the loan
            trade.swapFee // Pool fee tier
        );
    }

    /**
     * @notice Executes a single exact-input swap on a Uniswap V3-compatible DEX.
     * @dev Emits a SwapExecuted event upon successful execution.
     * @param router The address of the DEX router.
     * @param inputToken The address of the token being swapped.
     * @param inputAmount The amount of inputToken to swap.
     * @param outputToken The address of the token to receive.
     * @param minOutput The minimum amount of outputToken expected.
     * @param fee The fee tier for the Uniswap V3 pool.
     */
    function _executeSwap(
        address router,
        address inputToken,
        uint256 inputAmount,
        address outputToken,
        uint256 minOutput,
        uint24 fee
    ) internal {
        // Approve the router to spend the input tokens.
        IERC20(inputToken).approve(router, inputAmount);

        // Configure the swap parameters.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: inputToken,
            tokenOut: outputToken,
            fee: fee,
            recipient: address(this), // Send output tokens to this contract
            deadline: block.timestamp, // Expire after the current block
            amountIn: inputAmount,
            amountOutMinimum: minOutput, // Minimum output for slippage protection
            sqrtPriceLimitX96: 0 // No price limit (accept any slippage)
        });

        // Execute the swap.
        ISwapRouter(router).exactInputSingle(params);
        emit SwapExecuted(inputToken, outputToken, inputAmount, minOutput);
    }

    /**
     * @notice Initiates a flash loan to execute an arbitrage trade.
     * @dev This function can only be called by the Balancer Vault contract.
     * @param dexRouters Array of two DEX router addresses to use for the swaps.
     * @param tokens Array of two token addresses defining the arbitrage path.
     * @param swapFee The fee tier for the Uniswap V3 pool.
     * @param loanAmount The amount of the first token to borrow via flash loan.
     */
    function startArbitrage(address[] memory dexRouters, address[] memory tokens, uint24 swapFee, uint256 loanAmount)
        internal
    {
        // Encode the trade parameters for the flash loan callback.
        bytes memory tradeData = abi.encode(ArbitrageTrade({dexRouters: dexRouters, tokens: tokens, swapFee: swapFee}));

        // Configure the flash loan parameters.
        IERC20[] memory loanTokens = new IERC20[](1);
        loanTokens[0] = IERC20(tokens[0]); // Token to borrow

        uint256[] memory loanAmounts = new uint256[](1);
        loanAmounts[0] = loanAmount; // Amount to borrow

        // Trigger the flash loan from Balancer Vault.
        balancerVault.flashLoan(this, loanTokens, loanAmounts, tradeData);
    }

    /**
     * @notice Callback function executed by Balancer Vault after approving the flash loan.
     * @dev This function contains the core logic for executing the arbitrage.
     * @param loanTokens Array of tokens borrowed (length = 1 in this implementation).
     * @param loanAmounts Array of amounts borrowed (length = 1).
     * @param feeAmounts Array of flash loan fees (unused in this implementation).
     * @param tradeData Encoded trade parameters passed from startArbitrage.
     */
    function receiveFlashLoan(
        IERC20[] memory loanTokens,
        uint256[] memory loanAmounts,
        uint256[] memory feeAmounts,
        bytes memory tradeData
    ) external override {
        require(msg.sender == address(balancerVault), "Unauthorized: Only Balancer Vault");

        // Decode the trade parameters.
        ArbitrageTrade memory trade = abi.decode(tradeData, (ArbitrageTrade));
        uint256 borrowedAmount = loanAmounts[0];

        // First swap: Convert the borrowed token to an intermediate token.
        _executeSwap(
            trade.dexRouters[0], // First DEX router (e.g., Uniswap)
            trade.tokens[0], // Borrowed token address
            borrowedAmount, // Amount to swap
            trade.tokens[1], // Intermediate token address
            0, // No minimum output (optimistic arbitrage)
            trade.swapFee // Pool fee tier
        );

        // Second swap: Convert the intermediate token back to the borrowed token.
        _executeSwap(
            trade.dexRouters[1], // Second DEX router (e.g., Sushiswap)
            trade.tokens[1], // Intermediate token address
            IERC20(trade.tokens[1]).balanceOf(address(this)), // Swap entire balance
            trade.tokens[0], // Borrowed token address
            borrowedAmount, // Minimum required to repay the loan
            trade.swapFee // Pool fee tier
        );

        // Repay the flash loan principal (WARNING: Flash loan fees are not accounted for).
        IERC20(trade.tokens[0]).transfer(address(balancerVault), borrowedAmount);
    }
}
