const { ethers, network } = require("hardhat");

async function main() {
  console.log("──────────────────────────────────────────");
  console.log("  Deploiement BankChad sur", network.name);
  console.log("──────────────────────────────────────────");

  const [deployer] = await ethers.getSigners();
  console.log("Wallet deployeur :", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Solde du wallet  :", ethers.formatEther(balance), "ETH");
  console.log("");

  if (balance === 0n) {
    throw new Error("Solde insuffisant. Obtiens des ETH Sepolia sur https://sepoliafaucet.com");
  }

  console.log("Deploiement en cours...");
  const BankChad = await ethers.getContractFactory("BankChad");
  const bankChad = await BankChad.deploy();
  await bankChad.waitForDeployment();

  const address = await bankChad.getAddress();
  console.log("");
  console.log("✅  BankChad deploye a :", address);
  console.log("");
  console.log("👉  Copie cette adresse dans :");
  console.log("    frontend/.env.local -> VITE_CONTRACT_ADDRESS=" + address);
  console.log("    backend/.env        -> CONTRACT_ADDRESS=" + address);
  console.log("");
  console.log("🔗  Voir sur Etherscan :");
  console.log("    https://sepolia.etherscan.io/address/" + address);
  console.log("");

  const fs = require("fs");
  const deployInfo = {
    network: network.name,
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync("deployed.json", JSON.stringify(deployInfo, null, 2));
  console.log("📄  Adresse sauvegardee dans deployed.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur de deploiement :", error);
    process.exit(1);
  });
