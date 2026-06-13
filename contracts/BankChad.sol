// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BankChad is ReentrancyGuard, Ownable {
    mapping(address => uint256) private balances;
    uint256 public totalDeposits;
    uint256 public transactionCount;
    uint256 public feeBasisPoints;

    event Deposited(
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );

    event Withdrawn(
        address indexed user,
        uint256 amount,
        uint256 newBalance,
        uint256 timestamp
    );

    event Transferred(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    event FeesUpdated(uint256 oldFee, uint256 newFee);

    constructor() Ownable(msg.sender) {
        feeBasisPoints = 0;
    }

    function deposit() external payable nonReentrant {
        require(msg.value > 0, "BankChad: montant nul");
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        transactionCount++;
        emit Deposited(msg.sender, msg.value, balances[msg.sender], block.timestamp);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "BankChad: montant nul");
        require(balances[msg.sender] >= amount, "BankChad: solde insuffisant");
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        transactionCount++;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "BankChad: echec du transfert");
        emit Withdrawn(msg.sender, amount, balances[msg.sender], block.timestamp);
    }

    function transfer(address to, uint256 amount) external nonReentrant {
        require(to != address(0), "BankChad: adresse zero interdite");
        require(to != msg.sender, "BankChad: transfert a soi-meme interdit");
        require(amount > 0, "BankChad: montant nul");
        require(balances[msg.sender] >= amount, "BankChad: solde insuffisant");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        transactionCount++;
        emit Transferred(msg.sender, to, amount, block.timestamp);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function myBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function getStats() external view returns (
        uint256 _totalDeposits,
        uint256 _transactionCount,
        uint256 _contractBalance
    ) {
        return (totalDeposits, transactionCount, address(this).balance);
    }

    function setFee(uint256 newFeeBasisPoints) external onlyOwner {
        require(newFeeBasisPoints <= 500, "BankChad: frais max 5%");
        emit FeesUpdated(feeBasisPoints, newFeeBasisPoints);
        feeBasisPoints = newFeeBasisPoints;
    }
}
