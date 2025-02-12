// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// import {Test, console} from "forge-std/Test.sol";
// import {SuperchainWrappedToken} from "../../src/superchain/SuperchainWrappedToken.sol";
// //import {SuperchainWrappedTokenFactory} from "../../src/superchain/SuperchainWrappedTokenFactory.sol";
// import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract MockERC20 is ERC20 {
//     constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

//     function mint(address to, uint256 amount) public {
//         _mint(to, amount);
//     }
// }

// contract TestSuperchainWrappedToken is Test {
//     SuperchainWrappedTokenFactory factory;
//     SuperchainWrappedToken sUSDC;
//     SuperchainWrappedToken sWETH;

//     event CrosschainMint(address indexed user, uint256 amount);
//     event CrosschainBurn(address indexed user, uint256 amount);

//     MockERC20 public usdc;
//     MockERC20 public weth;

//     address public bridge = 0x4200000000000000000000000000000000000010; // SUPERCHAIN_TOKEN_BRIDGE
//     address user = makeAddr("user");

//     function setUp() public {
//         // Deploy mock underlying tokens
//         usdc = new MockERC20("USDC", "USDC");
//         weth = new MockERC20("WETH", "WETH");

//         // Deploy factory
//         factory = new SuperchainWrappedTokenFactory(bridge);

//         // Deploy wrapped tokens through factory
//         address sUSDCAddress = factory.deployWrappedToken(address(usdc), "Superchain USDC", "sUSDC");
//         address sWETHAddress = factory.deployWrappedToken(address(weth), "Superchain WETH", "sWETH");

//         sUSDC = SuperchainWrappedToken(sUSDCAddress);
//         sWETH = SuperchainWrappedToken(sWETHAddress);
//     }

//     // Test 1: Factory Deployment Validation
//     function testFactoryDeployment() public {
//         // Verify USDC wrapper
//         assertEq(sUSDC.getUnderlying(), address(usdc), "Underlying USDC mismatch");
//         assertEq(sUSDC.name(), "Superchain USDC", "USDC name mismatch");
//         assertEq(sUSDC.symbol(), "sUSDC", "USDC symbol mismatch");
//         assertEq(sUSDC.bridge(), bridge, "USDC bridge address mismatch");

//         // Verify WETH wrapper
//         assertEq(sWETH.getUnderlying(), address(weth), "Underlying WETH mismatch");
//         assertEq(sWETH.name(), "Superchain WETH", "WETH name mismatch");
//         assertEq(sWETH.symbol(), "sWETH", "WETH symbol mismatch");
//         assertEq(sWETH.bridge(), bridge, "WETH bridge address mismatch");
//     }

//     // Test 2: Deposit Functionality
//     function testDeposit() public {
//         uint256 amount = 100e18;
//         usdc.mint(user, amount);

//         vm.startPrank(user);
//         usdc.approve(address(sUSDC), amount);
//         sUSDC.deposit(amount);
//         vm.stopPrank();

//         assertEq(sUSDC.balanceOf(user), amount, "User wrapped balance mismatch");
//         assertEq(usdc.balanceOf(user), 0, "User underlying balance mismatch");
//         assertEq(usdc.balanceOf(address(sUSDC)), amount, "Contract underlying balance mismatch");
//     }

//     // Test 3: Withdraw Functionality
//     function testWithdraw() public {
//         uint256 amount = 100e18;
//         usdc.mint(user, amount);

//         vm.startPrank(user);
//         usdc.approve(address(sUSDC), amount);
//         sUSDC.deposit(amount);
//         sUSDC.withdraw(amount);
//         vm.stopPrank();

//         assertEq(sUSDC.balanceOf(user), 0, "Wrapped balance not zero after withdraw");
//         assertEq(usdc.balanceOf(user), amount, "Underlying not returned after withdraw");
//     }

//     // Test 4: Cross-Chain Mint Authorization
//     function testCrossChainMint() public {
//         uint256 amount = 100e18;

//         vm.prank(bridge);
//         sUSDC.crosschainMint(user, amount);

//         assertEq(sUSDC.balanceOf(user), amount, "Mint didn't increase balance");
//     }

//     // Test 5: Cross-Chain Burn Authorization
//     function testCrossChainBurn() public {
//         uint256 amount = 100e18;

//         // First mint tokens to burn
//         vm.prank(bridge);
//         sUSDC.crosschainMint(user, amount);

//         // Burn the minted tokens
//         vm.prank(bridge);
//         sUSDC.crosschainBurn(user, amount);

//         assertEq(sUSDC.balanceOf(user), 0, "Burn didn't reduce balance");
//     }

//     // Test 6: Unauthorized Cross-Chain Calls
//     function testUnauthorizedCrossChainMint() public {
//         vm.expectRevert();
//         sUSDC.crosschainMint(user, 100e18);
//     }

//     // Test 7: Deterministic Deployment
//     function testDeterministicDeployment() public {
//         address predicted = factory.computeAddress(address(usdc), "Superchain USDC", "sUSDC");

//         address actual = factory.deployWrappedToken(address(usdc), "Superchain USDC", "sUSDC");

//         assertEq(actual, predicted, "Deployed address mismatch");
//     }

//     // Test 8: Decimal Handling
//     function testDecimals() public {
//         // Setup mock with 6 decimals
//         MockERC6Decimals mockUSDC = new MockERC6Decimals("USDC", "USDC");
//         SuperchainWrappedToken sUSDC6 =
//             SuperchainWrappedToken(factory.deployWrappedToken(address(mockUSDC), "sUSDC", "sUSDC"));

//         assertEq(sUSDC6.decimals(), 6, "Decimal mismatch");
//     }

//     // Test 9: Insufficient Balance Withdraw
//     function testInsufficientWithdraw() public {
//         vm.expectRevert();
//         vm.prank(user);
//         sUSDC.withdraw(1);
//     }

//     // Test 10: Deposit Without Approval
//     function testDepositWithoutApproval() public {
//         usdc.mint(user, 100e18);

//         vm.expectRevert();
//         vm.prank(user);
//         sUSDC.deposit(100e18);
//     }
// }

// contract MockERC6Decimals is ERC20 {
//     constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

//     function decimals() public pure override returns (uint8) {
//         return 6;
//     }
// }
