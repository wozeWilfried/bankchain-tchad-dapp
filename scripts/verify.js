const { run } = require("hardhat");
const deployInfo = require("../deployed.json");

async function main() {
  console.log("Verification du contrat :", deployInfo.address);

  await run("verify:verify", {
    address: deployInfo.address,
    constructorArguments: [],
  });

  console.log("✅  Contrat verifie sur Etherscan !");
  console.log("🔗  https://sepolia.etherscan.io/address/" + deployInfo.address + "#code");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur de verification :", error);
    process.exit(1);
  });
