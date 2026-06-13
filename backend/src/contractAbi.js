const CONTRACT_ABI = [
  "function getStats() view returns (uint256 totalDeposits, uint256 transactionCount, uint256 contractBalance)",
  "function getBalance(address user) view returns (uint256)",
  "event Deposited(address indexed user, uint256 amount, uint256 newBalance, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 newBalance, uint256 timestamp)",
  "event Transferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp)",
];

module.exports = { CONTRACT_ABI };
