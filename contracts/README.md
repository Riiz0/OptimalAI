# OptimalAI: AI-Powered DeFi Portfolio Manager

**OptimalAI** is a comprehensive DeFi portfolio management system that leverages artificial intelligence to optimize investments across multiple protocols. The system consists of a modular smart contract architecture that enables secure asset management, automated trading strategies, and cross-protocol interactions.

---

## 🚀 Features

- **AI-Driven Yield Optimization**: Dynamically reallocates funds to the highest-yielding opportunities across DeFi protocols.
- **On-Chain Automation**: Uses **ElizaAI** to automate fund movements and strategy execution.
- **Multi-Protocol Integration**:
    - **Lending/Borrowing**: Aave V3, Compound
    - **DEX/Liquidity**: Uniswap V3 and other forked V3s
    - **Flash Loan Integration**: Balancer V2: Flash loan capabilities for arbitrage opportunities
    - **Future Support**: TBD
- **User-Friendly Vaults**: Each user gets a personalized vault to deposit funds and set strategies.
- **Smart Vault System**:
   - Personalized Vaults
      - Individual vault deployment per user through SafeVaultDeployer
      - Comprehensive investment tracking per token
      - Whitelisted address system for enhanced security
- **Investment Tracking**:
   - Real-time balance monitoring across protocols
   - Detailed position management for lending and liquidity
   - Unified view of portfolio allocation
- **Advanced DeFi Operations**:
   - Lending Operations
      - Protocol-specific lending strategies
      - Automated interest rate optimization
      - Collateral management
   - Liquidity Management
      - Custom tick range selection for Uniswap V3
      - Dynamic fee tier optimization
      - Automated position rebalancing
   - Trading Operations
      - Cross-protocol token swaps
      - Arbitrage execution with flash loans
      - Slippage protection mechanisms
- **Security Features**:
   - Access Control
      - Owner-controlled deposit and withdrawal system
      - Whitelist system for authorized operations
      - Protocol-specific approval management
   - Risk Management
      - Balance checks before operations
      - Protocol-specific safety checks
      - Transaction failure handling
---

## 🛠️ Tech Stack

- **Core Framework**: [Foundry](https://foundry.paradigm.xyz)
- **Blockchain**: [Arbitrum](https://arbitrum.io), [Avalanche](https://www.avax.network/)
- **Smart Contracts**: Solidity (Foundry for testing and deployment)
- **Integrated Protocols**:
   - [Aave](https://app.aave.com/)
   - [Compound](https://compound.finance/)
   - [Uniswap V3](https://app.uniswap.org/)
   - [Balancer V2](https://balancer.fi/)

---

## 📦 Deployments

### TBA : coming soon

---

## 🏗️ Architecture Overview

OptimalAI is built on a modular architecture, with the following key components:

### 1. **SafeVaultDeployer**
- Factory contract for deploying user vaults
- Maintains registry of vault ownership
- Handles network-specific configurations
- Manages protocol integrations

### 2. **SafeVault**
- Core user interaction contract
- Inherits ProtocolHelper functionality
- Manages deposits, withdrawals, and investments
- Tracks investment positions through Investment struct:
```javascript
struct Investment {
    address tokenAddress;
    uint256 balanceUnderlying;
    uint256 balanceInvestedInAave;
    uint256 balanceInvestedInCompound;
    uint256 balanceInvestedInUniswap;
}
```

### 3. **ProtocolHelper**
- Protocol interaction layer
- Implements standardized interfaces for:
   - Aave V3 lending operations
   - Compound V3 deposit management
   - Uniswap V3 liquidity and swap operations
- Manages protocol-specific balance tracking

### 4. **OptimalArbitrage**
- Flash loan-based arbitrage execution
- Integrates with Balancer V2 for flash loans
- Implements cross-protocol swap logic
- Optimizes for profitable trading opportunities

---

## 🛠️ Technical Implementation
### **Protocol Integration**
```javascript
contract ProtocolHelper {
    IPool public aaveLiquidityPool;
    CometMainInterface public cUSDC;
    ISwapRouter public immutable uniswapSwapRouter;
    IUniswapV3Factory public immutable uniswapPoolFactory;
    INonfungiblePositionManager public immutable nonfungiblePositionManager;
}
```
### **Investment Management**
```javascript
mapping(address => Investment) public tokenAddressToInvestmentStruct;
mapping(address => bool) public isWhitelisted;
```

### **Arbitrage Execution**
```javascript
struct ArbitrageTrade {
    address[] dexRouters;
    address[] tokens;
    uint24 swapFee;
}
```

---

## 📂 Repository Structure

```
contracts/
    ├── lib/ # Dependencies
    ├── scripts/ # Deployment and utility scripts
    ├── src/ # Smart contracts for onchain actions
    ├── test/ # Unit & Forked Tests of Smart contracts
    ├── scripts/ # Deployment and utility scripts
    ├── README.md # This file
    └── LICENSE # MIT License
```

## Setup Instructions

### Prerequisites

1. **Foundry**: Install Foundry for smart contract development and testing.
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Riiz0/OptimalAI.git
   cd OptimalAI
   ```

2. Install dependencies:

   ```bash
   forge install
   ```

3. Compile the smart contract:

   ```bash
   forge build
   ```

4. Deploy the contract to the Testnet:

   ```bash
   Coming Soon
   ```

## Testing

Foundry is used for testing the contracts. To run the tests:

1. Write your tests in the test directory.

2. Run the tests using:
   ```bash
   forge test
   ```

---

## 🚨 Disclaimer

OptimalAI is a proof-of-concept project built for the **Safe Agentathon** hackathon. It is not audited and should not be used in production. Use at your own risk.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Safe** for hosting the **Safe Agentathon** hackathon.
- **Safe**, **Aave**, **Compound**, **Uniswap**, **Arbitrum**, **Avalanche** and **ElizaAI** for their support and tooling.
