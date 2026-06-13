export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID);
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const CONTRACT_ABI = [
  "function getBalance(address user) view returns (uint256)",
  "function myBalance() view returns (uint256)",
  "function getStats() view returns (uint256 totalDeposits, uint256 transactionCount, uint256 contractBalance)",
  "function totalDeposits() view returns (uint256)",
  "function transactionCount() view returns (uint256)",
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function transfer(address to, uint256 amount)",
  "event Deposited(address indexed user, uint256 amount, uint256 newBalance, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 newBalance, uint256 timestamp)",
  "event Transferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp)",
];
