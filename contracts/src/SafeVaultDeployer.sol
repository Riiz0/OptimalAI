// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./SafeVault.sol";
import "../script/HelperConfig.s.sol";

/**
 * @title SafeVaultDeployer
 * @author OptimalAI
 * @notice A factory contract for deploying and managing individual Vault instances.
 * @dev This contract inherits from HelperConfig to access network-specific configurations.
 *      It maintains a registry of vault addresses mapped to their owners and handles
 *      the deployment of new vault instances with appropriate protocol integrations.
 */
contract SafeVaultDeployer is HelperConfig {
    /// @notice Mapping from owner addresses to their respective vault contract addresses.
    /// @dev Each owner can have only one vault in the current implementation.
    mapping(address => address) public ownerToVault;

    /**
     * @notice Emitted when a new vault is successfully deployed.
     * @param owner The address of the vault owner.
     * @param vaultAddress The address of the newly created vault contract.
     */
    event NewVaultDeployed(address indexed owner, address indexed vaultAddress);

    /// @notice Current network configuration containing protocol addresses.
    /// @dev Retrieved from HelperConfig during contract initialization.
    HelperConfig.NetworkConfig public currentNetworkConfig;

    /**
     * @notice Initializes the VaultManager with Base Sepolia network configurations.
     * @dev Sets up the contract with predefined addresses for DeFi protocol integrations.
     *      Currently hardcoded to Base Sepolia, but can be extended for other networks.
     */
    constructor() {
        currentNetworkConfig = getBaseSepoliaConfig();
    }

    /**
     * @notice Deploys a new Vault instance for the specified owner.
     * @dev Creates a new Vault contract with protocol addresses from the current network configuration
     *      and registers it in the ownerToVault mapping.
     * @param owner Address that will own and control the new vault.
     * @return vaultAddress The address of the newly created vault contract.
     * @custom:integration Integrates with Aave, Compound, and Uniswap protocols.
     */
    function deployVault(
        address owner
    ) external returns (address vaultAddress) {
        // Deploy a new Vault instance with protocol addresses from the network config.
        SafeVault newVault = new SafeVault(
            owner,
            currentNetworkConfig.aavePool,
            currentNetworkConfig.compoundUsdc,
            currentNetworkConfig.uniswapRouter,
            currentNetworkConfig.uniswapFactory,
            currentNetworkConfig.nonFungiblePositionManager
        );

        // Register the new vault in the ownership mapping.
        ownerToVault[owner] = address(newVault);

        // Emit an event for tracking and indexing.
        emit NewVaultDeployed(owner, address(newVault));

        return address(newVault);
    }

    /**
     * @notice Retrieves the vault address associated with the caller.
     * @dev Returns the vault address mapped to the message sender.
     * @return The address of the caller's vault, or the zero address if none exists.
     */
    function fetchVaultAddress() external view returns (address) {
        return ownerToVault[msg.sender];
    }
}
