// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ICrossDomainMessenger} from "./interfaces/ICrossDomainMessenger.sol";
import {IStandardBridge} from "./interfaces/IStandardBridge.sol";

contract CrossChainManager {
    address public owner;
    ICrossDomainMessenger public messenger;
    IStandardBridge public bridge;

    constructor(address payable _messenger, address payable _bridge) {
        owner = msg.sender;
        messenger = ICrossDomainMessenger(_messenger);
        bridge = IStandardBridge(_bridge);
    }

    /**
     * @notice Sends a cross-chain message to execute arbitrage on another chain.
     * @param target The address of the contract on the destination chain.
     * @param data The encoded function call data.
     */
    function sendCrossChainMessage(address target, bytes memory data) external {
        require(msg.sender == owner, "Unauthorized");
        messenger.sendMessage(target, data, 1000000); // Gas limit for the message
    }

    /**
     * @notice Bridges tokens to another chain.
     * @param token The address of the token to bridge.
     * @param amount The amount of tokens to bridge.
     * @param recipient The address to receive the tokens on the destination chain.
     */
    function bridgeTokens(
        address token,
        uint256 amount,
        address recipient
    ) external {
        require(msg.sender == owner, "Unauthorized");
        bridge.bridgeERC20To(token, token, recipient, amount, 1000000, ""); // Gas limit for the deposit
    }
}
