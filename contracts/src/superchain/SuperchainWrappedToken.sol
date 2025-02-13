// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC7802, IERC165} from "./interfaces/IERC7802.sol";

contract SuperchainWrappedToken is ERC20, IERC7802 {
    address public immutable bridge;
    IERC20 public immutable underlying;
    uint8 private immutable _decimals;

    constructor(
        address _underlying,
        string memory _name,
        string memory _symbol,
        address _bridge
    ) ERC20(_name, _symbol) {
        underlying = IERC20(_underlying);
        bridge = _bridge;

        // Fetch the decimals of the underlying token
        _decimals = _getDecimals(_underlying);
    }

    function deposit(uint256 amount) external {
        underlying.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        underlying.transfer(msg.sender, amount);
    }

    function crosschainMint(address to, uint256 amount) external override {
        //require(msg.sender == bridge, "Unauthorized");
        _mint(to, amount);
    }

    function crosschainBurn(address from, uint256 amount) external override {
        //require(msg.sender == bridge, "Unauthorized");
        _burn(from, amount);
    }

    function getUnderlying() external view returns (address) {
        return address(underlying);
    }

    function getBridge() external view returns (address) {
        return bridge;
    }

    /// @inheritdoc IERC165
    function supportsInterface(
        bytes4 _interfaceId
    ) public view virtual returns (bool) {
        return
            _interfaceId == type(IERC7802).interfaceId ||
            _interfaceId == type(IERC20).interfaceId ||
            _interfaceId == type(IERC165).interfaceId;
    }

    /// @dev Override the `decimals` function to match the underlying token's decimals
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @dev Helper function to fetch the decimals of the underlying token
    function _getDecimals(address token) private view returns (uint8) {
        (bool success, bytes memory data) = token.staticcall(
            abi.encodeWithSignature("decimals()")
        );
        require(success, "Failed to fetch decimals");
        return abi.decode(data, (uint8));
    }
}
