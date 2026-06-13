const express = require("express");
const { ethers } = require("ethers");
const { CONTRACT_ABI } = require("../contractAbi");

const router = express.Router();

const DEMO_USERS = [
  { name: "Alice M.", email: "alice@bankchain.td", address: "0x1234567890abcdef1234567890abcdef12345678", role: "Utilisateur" },
  { name: "Bob K.", email: "bob@bankchain.td", address: "0xabcdef1234567890abcdef1234567890abcdef12", role: "Commerçant" },
  { name: "Fatima D.", email: "fatima@bankchain.td", address: "0x7890abcdef1234567890abcdef1234567890abcd", role: "Investisseur" },
  { name: "Admin", email: "admin@bankchain.td", address: "0x7E81F2eb2e3B280502130086fE16f54351084589", role: "Administrateur" },
];

router.get("/demo", async (req, res) => {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  const users = await Promise.all(
    DEMO_USERS.map(async (u) => {
      let balance = "0";
      try {
        const bal = await contract.getBalance(u.address);
        balance = ethers.formatEther(bal);
      } catch {
        // adresse sans interaction avec le contrat
      }
      return { ...u, balance };
    })
  );

  res.json({ users });
});

module.exports = router;
