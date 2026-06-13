const express  = require("express");
const { ethers } = require("ethers");
const { transactions } = require("../indexer");
const { CONTRACT_ABI }  = require("../contractAbi");

const router = express.Router();

router.get("/", (req, res) => {
  const { address, type, limit = 50, page = 1 } = req.query;

  let result = [...transactions];

  if (address) {
    const addr = address.toLowerCase();
    result = result.filter((tx) =>
      (tx.user  && tx.user.toLowerCase()  === addr) ||
      (tx.from  && tx.from.toLowerCase()  === addr) ||
      (tx.to    && tx.to.toLowerCase()    === addr)
    );
  }

  if (type) {
    result = result.filter((tx) => tx.type === type.toUpperCase());
  }

  const start = (page - 1) * limit;
  const end   = start + parseInt(limit);

  res.json({
    total:        result.length,
    page:         parseInt(page),
    limit:        parseInt(limit),
    transactions: result.slice(start, end),
  });
});

router.get("/stats", async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );
    const [totalDeposits, txCount, contractBalance] = await contract.getStats();

    res.json({
      totalDeposits:   ethers.formatEther(totalDeposits),
      transactionCount: txCount.toString(),
      contractBalance:  ethers.formatEther(contractBalance),
      indexedCount:     transactions.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Adresse invalide" });
    }

    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );
    const balance = await contract.getBalance(address);

    res.json({
      address,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
