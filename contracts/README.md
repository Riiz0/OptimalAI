# OptimalAI: AI-Powered DeFi Portfolio Manager

**OptimalAI** is a smart contract-based DeFi portfolio manager that leverages artificial intelligence to optimize your DeFi investments across multiple protocols. It provides a secure and efficient way to manage assets across leading DeFi platforms including **Aave**, **Compound**, and **Uniswap**.

---

## 🚀 Features

- **Multi-Protocol Integration**: Seamlessly interact with multiple DeFi protocols:
    - **Lending/Borrowing**: Aave V3, Compound
    - **DEX/Liquidity**: Uniswap V3
    - **Future Support**: TBD
- **Advanced DeFi Operations**:
    - Token lending and borrowing
    - Liquidity provision
    - Token swaps
    - Position management
    - Cross-chain interactions (Planned)
- **Smart Vault System**:
    - Secure asset management through dedicated SafeVault contracts
    - Whitelisted address system for enhanced security
    - Comprehensive investment tracking per token
    - Owner-controlled deposit and withdrawal system
- **User-Friendly Vaults**: Each user gets a personalized vault to deposit funds and set strategies.
- **AI-Driven Yield Optimization**: Dynamically reallocates funds to the highest-yielding opportunities across DeFi protocols.
- **On-Chain Automation**: Uses **ElizaAI** to automate fund movements and strategy execution.

---

## 🛠️ Tech Stack

- **Core Framework**: [Foundry](https://foundry.paradigm.xyz)
- **Blockchain**: [Arbitrum](https://arbitrum.io)
- **Smart Contracts**: Solidity (Foundry for testing and deployment)

---

## 📦 Deployments

### TBA : coming soon

---

## 🏗️ Architecture Overview

OptimalAI is built on a modular architecture, with the following key components:

### 1. **ProtocolHelper**
- Handles core protocol interactions
- Implements protocol-specific operations
- Manages liquidity positions
- Tracks protocol-specific balances

### 2. **SafeVault**
- Inherits ProtocolHelper functionality
- Manages user deposits and withdrawals
- Tracks investment positions
- Controls access through whitelist system
- Implements owner-specific operations

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
- **Safe**, **Aave**, **Compound**, **Uniswap**, **Arbitrum**, and **ElizaAI** for their support and tooling.
