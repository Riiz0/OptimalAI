// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ProtocolHelper} from "./ProtocolHelper.sol";

/**
 * @title SafeVault
 * @author OptimalAI
 * @notice This is a vault contract for a single user address used to track investments and implement strategies.
 * @notice This contract inherits OptimalAI's ProtocolHelper contract to interact with various DEFI protocols.
 * @notice It allows users to deposit and withdraw ERC20 tokens into their vault.
 * @notice It also allows users to get their investment details for a protocol.
 */
contract SafeVault is Ownable, ProtocolHelper {
    struct Investment {
        address tokenAddress;
        uint256 balanceUnderlying;
        uint256 balanceInvestedInAave;
        uint256 balanceInvestedInCompound;
        uint256 balanceInvestedInUniswap;
    }

    /// @notice Mapping from token address to investment struct.
    mapping(address => Investment) public tokenAddressToInvestmentStruct;
    /// @notice Mapping from user address to is whitelisted.
    mapping(address => bool) public isWhitelisted;

    event ERC20DepositedIntoVault(address indexed token, uint256 amount);
    event ERC20WithdrawnFromVault(address indexed token, uint256 amount);

    error InvalidProtocol(string protocol);
    error AerodromeNotImplementedYet();
    error OnlyWhitelistedAddresses();
    // error TokensNotApproved();
    error TransferFailed();
    error InsufficientTokensInVault(address token);

    modifier onlyWhitelisted(address _address) {
        if (!isWhitelisted[_address]) {
            revert OnlyWhitelistedAddresses();
        }
        _;
    }

    modifier validLendingProtocol(string memory protocol) {
        if (
            keccak256(bytes(protocol)) != keccak256(bytes("aave"))
                && keccak256(bytes(protocol)) != keccak256(bytes("compound"))
        ) {
            revert InvalidProtocol(protocol);
        }
        _;
    }

    modifier validLiquidityProtocol(string memory protocol) {
        if (
            keccak256(bytes(protocol)) != keccak256(bytes("uniswap"))
                && keccak256(bytes(protocol)) != keccak256(bytes("aerodrome"))
        ) {
            revert InvalidProtocol(protocol);
        }
        _;
    }

    constructor(
        address _owner,
        address _aaveLiquidityPool,
        address _cUSDC,
        address _uniswapSwapRouter,
        address _uniswapPoolFactory,
        address _INonfungiblePositionManager
    )
        Ownable(_owner)
        ProtocolHelper(_aaveLiquidityPool, _cUSDC, _uniswapSwapRouter, _uniswapPoolFactory, _INonfungiblePositionManager)
    {}

    /**
     * @notice Add a whitelisted address.
     * @notice Only the owner can add a whitelisted address.
     * @param _address Address to add.
     */
    function addWhitelistedAddress(address _address) external onlyOwner {
        isWhitelisted[_address] = true;
    }

    /**
     * @notice Remove a whitelisted address.
     * @notice Only the owner can remove a whitelisted address.
     * @param _address Address to remove.
     */
    function removeWhitelistedAddress(address _address) external onlyOwner {
        isWhitelisted[_address] = false;
    }

    /**
     * @notice Deposit ERC20 token into the vault.
     * @notice Only the owner can deposit ERC20 tokens into the vault.
     * @param _token Token address to deposit.
     * @param _amount Amount of token to deposit.
     */
    function depositERC20intoVault(address _token, uint256 _amount) external onlyOwner {
        if (IERC20(_token).allowance(msg.sender, address(this)) < _amount) {
            revert TokensNotApproved("Vault");
        }
        bool success = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        if (!success) {
            revert TransferFailed();
        }
        tokenAddressToInvestmentStruct[_token].balanceUnderlying += _amount;
        emit ERC20DepositedIntoVault(_token, _amount);
    }

    /**
     * @notice Withdraw ERC20 tokens from the vault.
     * @notice Only the owner can withdraw ERC20 tokens from the vault.
     * @param _token Token address to withdraw.
     * @param _amount Amount of token to withdraw.
     */
    function withdrawERC20FromVault(address _token, uint256 _amount) external onlyOwner {
        if (tokenAddressToInvestmentStruct[_token].balanceUnderlying < _amount) {
            revert InsufficientTokensInVault(_token);
        }
        IERC20(_token).approve(owner(), _amount);
        bool success = IERC20(_token).transfer(owner(), _amount);
        if (!success) {
            revert TransferFailed();
        }
        tokenAddressToInvestmentStruct[_token].balanceUnderlying -= _amount;
        emit ERC20WithdrawnFromVault(_token, _amount);
    }

    /**
     * @notice Lend ERC20 tokens to a lending protocol.
     * @notice Only the whitelisted addresses (like the agent wallet address) can call this function, ie invest on the owner's behalf.
     * @param protocol The protocol to lend to (aave or compound).
     * @param _token The token to lend.
     * @param _amount The amount of token to lend.
     */
    function lendERC20(string memory protocol, address _token, uint256 _amount)
        external
        onlyWhitelisted(msg.sender)
        validLendingProtocol(protocol)
    {
        if (tokenAddressToInvestmentStruct[_token].balanceUnderlying < _amount) {
            revert InsufficientTokensInVault(_token);
        }
        if (keccak256(bytes(protocol)) == keccak256(bytes("aave"))) {
            lendTokenOnAave(_token, _amount);
            tokenAddressToInvestmentStruct[_token].balanceInvestedInAave += _amount;
        } else if (keccak256(bytes(protocol)) == keccak256(bytes("compound"))) {
            lendTokenOnCompound(_token, _amount);
            tokenAddressToInvestmentStruct[_token].balanceInvestedInCompound += _amount;
        }
        tokenAddressToInvestmentStruct[_token].balanceUnderlying -= _amount;
    }

    /**
     * @notice Withdraw ERC20 tokens from a lending protocol.
     * @notice Only the whitelisted addresses (like the agent wallet address) can call this function, ie invest on the owner's behalf.
     * @param protocol The protocol to withdraw from (aave or compound).
     * @param _token The token to withdraw.
     * @param _amount The amount of token to withdraw.
     */
    function withdrawLentERC20(string memory protocol, address _token, uint256 _amount)
        external
        onlyWhitelisted(msg.sender)
        validLendingProtocol(protocol)
        returns (uint256 amountWithdrawn)
    {
        if (keccak256(bytes(protocol)) == keccak256(bytes("aave"))) {
            amountWithdrawn = withdrawLentTokensOnAave(_token, _amount);
            tokenAddressToInvestmentStruct[_token].balanceInvestedInAave -= _amount;
        } else if (keccak256(bytes(protocol)) == keccak256(bytes("compound"))) {
            amountWithdrawn = withdrawLentTokensOnCompound(_token, _amount);
            tokenAddressToInvestmentStruct[_token].balanceInvestedInCompound -= _amount;
        }
        tokenAddressToInvestmentStruct[_token].balanceUnderlying += amountWithdrawn;
        return amountWithdrawn;
    }

    /**
     * @notice Lend ERC20 tokens to a LP protocol.
     * @notice Only the whitelisted addresses (like the agent wallet address) can call this function, ie invest on the owner's behalf.
     * @param protocol The protocol to lend to (uniswap or aerodrome).
     * @param _token0 The first token to lend.
     * @param _token1 The second token to lend.
     * @param _amount0 The amount of token0 to lend.
     * @param _amount1 The amount of token1 to lend.
     * @param _fee The fee to lend on.
     * @param _tickLower The lower tick to lend on.
     * @param _tickUpper The upper tick to lend on.
     */
    function supplyTokenPairToLPProtocol(
        string memory protocol,
        address _token0,
        address _token1,
        uint256 _amount0,
        uint256 _amount1,
        uint24 _fee,
        int24 _tickLower,
        int24 _tickUpper
    ) external onlyWhitelisted(msg.sender) validLiquidityProtocol(protocol) {
        if (tokenAddressToInvestmentStruct[_token0].balanceUnderlying < _amount0) {
            revert InsufficientTokensInVault(_token0);
        }
        if (tokenAddressToInvestmentStruct[_token1].balanceUnderlying < _amount1) {
            revert InsufficientTokensInVault(_token1);
        }

        if (keccak256(bytes(protocol)) == keccak256(bytes("uniswap"))) {
            addLiquidityOnUniswap(_token0, _token1, _amount0, _amount1, _fee, _tickLower, _tickUpper);
            tokenAddressToInvestmentStruct[_token0].balanceInvestedInUniswap += _amount0;
            tokenAddressToInvestmentStruct[_token1].balanceInvestedInUniswap += _amount1;
        } else if (keccak256(bytes(protocol)) == keccak256(bytes("aerodrome"))) {
            revert AerodromeNotImplementedYet();
        }
        tokenAddressToInvestmentStruct[_token0].balanceUnderlying -= _amount0;
        tokenAddressToInvestmentStruct[_token1].balanceUnderlying -= _amount1;
    }

    /**
     * @notice Withdraw ERC20 tokens from a LP protocol.
     * @notice Only the whitelisted addresses (like the agent wallet address) can call this function, ie invest on the owner's behalf.
     * @param protocol The protocol to withdraw from (uniswap or aerodrome).
     * @param _token0 The first token to withdraw from.
     * @param _token1 The second token to withdraw from.
     * @param _liquidityAmount The amount of liquidity to withdraw.
     */
    function withdrawTokenPairFromLPProtocol(
        string memory protocol,
        address _token0,
        address _token1,
        uint24 _fee,
        uint128 _liquidityAmount
    )
        external
        onlyWhitelisted(msg.sender)
        validLiquidityProtocol(protocol)
        returns (uint256 amount0, uint256 amount1)
    {
        if (keccak256(bytes(protocol)) == keccak256(bytes("uniswap"))) {
            (amount0, amount1) = withdrawLiquidityFromUniswap(_token0, _token1, _fee, _liquidityAmount);
        } else if (keccak256(bytes(protocol)) == keccak256(bytes("aerodrome"))) {
            revert AerodromeNotImplementedYet();
        }
        tokenAddressToInvestmentStruct[_token0].balanceUnderlying += amount0;
        tokenAddressToInvestmentStruct[_token1].balanceUnderlying += amount1;
    }

    /**
     * @notice Swap ERC20 tokens on a LP protocol.
     * @param _tokenIn The token to swap from.
     * @param _tokenOut The token to swap to.
     * @param _amountIn The amount of tokenIn to swap.
     * @param _fee The fee to swap on.
     */
    function swapOnLPProtocol(
        string memory protocol,
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint24 _fee
    ) external onlyWhitelisted(msg.sender) validLiquidityProtocol(protocol) returns (uint256 amountOut) {
        if (tokenAddressToInvestmentStruct[_tokenIn].balanceUnderlying < _amountIn) {
            revert InsufficientTokensInVault(_tokenIn);
        }
        if (keccak256(bytes(protocol)) == keccak256(bytes("uniswap"))) {
            amountOut = executeSwapOnUniswap(_tokenIn, _tokenOut, _amountIn, 1, _fee);
        } else if (keccak256(bytes(protocol)) == keccak256(bytes("aerodrome"))) {
            revert AerodromeNotImplementedYet();
        }
        tokenAddressToInvestmentStruct[_tokenIn].balanceUnderlying -= _amountIn;
        tokenAddressToInvestmentStruct[_tokenOut].balanceUnderlying += amountOut;
    }

    /**
     * @notice Do arbitrage on Uniswap.
     * @param _routerPath The router path to do arbitrage on.
     * @param _tokenPath The token path to do arbitrage on.
     * @param _fee The fee to do arbitrage on.
     * @param _amount The amount to do arbitrage on.
     */
    function doArbitrage(address[] memory _routerPath, address[] memory _tokenPath, uint24 _fee, uint256 _amount)
        external
        onlyWhitelisted(msg.sender)
    {
        if (tokenAddressToInvestmentStruct[_tokenPath[0]].balanceUnderlying < _amount) {
            revert InsufficientTokensInVault(_tokenPath[0]);
        }
        // ArbitrageWithoutFlashLoan(_routerPath, _tokenPath, _fee, _amount);
    }

    /**
     * @notice Get the struct details for a token address.
     * @param _token Token address to get the struct details for.
     * @return investmentStruct Struct details for the token.
     */
    function getUserStruct(address _token) external view returns (Investment memory) {
        return tokenAddressToInvestmentStruct[_token];
    }
}
