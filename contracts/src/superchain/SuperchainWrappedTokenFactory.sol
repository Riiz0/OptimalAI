// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
// import {SuperchainWrappedToken} from "./SuperchainWrappedToken.sol";

// contract SuperchainWrappedTokenFactory {
//     using Create2 for bytes32;

//     address public immutable bridge;

//     event WrappedTokenCreated(address indexed underlying, address wrappedToken);

//     constructor(address _bridge) {
//         bridge = _bridge;
//     }

//     function computeAddress(address _underlying, string memory _name, string memory _symbol)
//         public
//         view
//         returns (address)
//     {
//         bytes32 salt = keccak256(abi.encodePacked(_underlying));
//         bytes memory creationCode =
//             abi.encodePacked(type(SuperchainWrappedToken).creationCode, abi.encode(_underlying, _name, _symbol, bridge));
//         return Create2.computeAddress(salt, keccak256(creationCode), address(this));
//     }

//     function deployWrappedToken(address _underlying, string memory _name, string memory _symbol)
//         external
//         returns (address wrappedToken)
//     {
//         bytes32 salt = keccak256(abi.encodePacked(_underlying));
//         wrappedToken = Create2.deploy(
//             0,
//             salt,
//             abi.encodePacked(type(SuperchainWrappedToken).creationCode, abi.encode(_underlying, _name, _symbol, bridge))
//         );
//         emit WrappedTokenCreated(_underlying, wrappedToken);
//     }
// }
