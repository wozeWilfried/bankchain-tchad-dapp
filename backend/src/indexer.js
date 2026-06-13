const { ethers } = require("ethers");
const { CONTRACT_ABI } = require("./contractAbi");

const transactions = [];
let lastPolledBlock = 0;

async function startIndexer() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  console.log("🔗  Indexer connecte a Sepolia");
  console.log("📋  Contrat :", process.env.CONTRACT_ADDRESS);

  await loadHistory(contract, provider);

  setInterval(async () => {
    try {
      const latestBlock = await provider.getBlockNumber();
      if (latestBlock <= lastPolledBlock) return;

      const fromBlock = Math.max(lastPolledBlock + 1, latestBlock - 50);
      const [deposits, withdrawals, transfers] = await Promise.all([
        contract.queryFilter(contract.filters.Deposited(), fromBlock, latestBlock),
        contract.queryFilter(contract.filters.Withdrawn(), fromBlock, latestBlock),
        contract.queryFilter(contract.filters.Transferred(), fromBlock, latestBlock),
      ]);

      deposits.forEach((e) => addTx("DEPOT", { user: e.args[0], amount: e.args[1], newBalance: e.args[2], timestamp: e.args[3], txHash: e.transactionHash }));
      withdrawals.forEach((e) => addTx("RETRAIT", { user: e.args[0], amount: e.args[1], newBalance: e.args[2], timestamp: e.args[3], txHash: e.transactionHash }));
      transfers.forEach((e) => addTx("TRANSFERT", { from: e.args[0], to: e.args[1], amount: e.args[2], timestamp: e.args[3], txHash: e.transactionHash }));

      lastPolledBlock = latestBlock;
    } catch (err) {
      // Erreur de polling ignoree
    }
  }, 20000);
}

function addTx(type, data) {
  const tx = { type, date: new Date(Number(data.timestamp) * 1000).toISOString(), timestamp: Number(data.timestamp) };
  if (type === "DEPOT" || type === "RETRAIT") {
    tx.user = data.user;
    tx.amount = ethers.formatEther(data.amount);
    tx.newBalance = ethers.formatEther(data.newBalance);
    console.log(`  ${type === "DEPOT" ? "✅ Depot" : "💸 Retrait"} : ${tx.amount} ETH de ${data.user.slice(0,8)}...`);
  } else {
    tx.from = data.from;
    tx.to = data.to;
    tx.amount = ethers.formatEther(data.amount);
    console.log(`  🔄 Transfert : ${tx.amount} ETH de ${data.from.slice(0,8)}... vers ${data.to.slice(0,8)}...`);
  }
  transactions.unshift(tx);
}

async function loadHistory(contract, provider) {
  try {
    lastPolledBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, lastPolledBlock - 1000);

    console.log(`📂  Chargement de l'historique (blocs ${fromBlock} -> ${lastPolledBlock})...`);

    const [deposits, withdrawals, transfers] = await Promise.all([
      contract.queryFilter(contract.filters.Deposited(), fromBlock, lastPolledBlock),
      contract.queryFilter(contract.filters.Withdrawn(), fromBlock, lastPolledBlock),
      contract.queryFilter(contract.filters.Transferred(), fromBlock, lastPolledBlock),
    ]);

    deposits.forEach((e) => {
      transactions.push({ type: "DEPOT", user: e.args[0], amount: ethers.formatEther(e.args[1]), newBalance: ethers.formatEther(e.args[2]), timestamp: Number(e.args[3]), date: new Date(Number(e.args[3]) * 1000).toISOString(), txHash: e.transactionHash });
    });
    withdrawals.forEach((e) => {
      transactions.push({ type: "RETRAIT", user: e.args[0], amount: ethers.formatEther(e.args[1]), newBalance: ethers.formatEther(e.args[2]), timestamp: Number(e.args[3]), date: new Date(Number(e.args[3]) * 1000).toISOString(), txHash: e.transactionHash });
    });
    transfers.forEach((e) => {
      transactions.push({ type: "TRANSFERT", from: e.args[0], to: e.args[1], amount: ethers.formatEther(e.args[2]), timestamp: Number(e.args[3]), date: new Date(Number(e.args[3]) * 1000).toISOString(), txHash: e.transactionHash });
    });

    transactions.sort((a, b) => b.timestamp - a.timestamp);
    console.log(`✅  ${transactions.length} transactions chargees depuis l'historique`);
  } catch (err) {
    console.error("Erreur chargement historique :", err.message);
  }
}

module.exports = { startIndexer, transactions };
