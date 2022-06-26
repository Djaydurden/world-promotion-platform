//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title World Promotion Platform DApp
 * @author Dhananjay & Shivali @ EthNYC June, 2022 
 **/
contract PromoToken is ERC20 {
constructor(uint256 initialSupply) ERC20("Prom", "PROM") {
        _mint(msg.sender, initialSupply);
    }

}