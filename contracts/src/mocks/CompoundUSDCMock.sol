// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CompoundUSDCMock
 * @author OptimalAI
 * @notice Mock compound usdc for testing
 */
contract CompoundUSDCMock is ERC20 {
    constructor() ERC20("Test USDC", "tUSDCv3") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function supplyTo(address dst, address asset, uint256 amount) public {
        require(IERC20(asset).allowance(msg.sender, address(this)) >= amount, "ERC20: insufficient allowance");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        _mint(dst, amount);
    }

    function withdraw(address asset, uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "ERC20: insufficient balance");
        _burn(msg.sender, amount);
        IERC20(asset).transfer(msg.sender, amount);
    }
}
