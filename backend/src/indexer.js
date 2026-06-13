const { ethers } = require("ethers");
const { CONTRACT_ABI } = require("./contractAbi");

const transactions = [];

async function startIndexer() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  console.log("🔗  Indexer connecte a Sepolia");
  console.log("📋  Contrat :", process.env.CONTRACT_ADDRESS);
  console.log("📡  Ecoute des evenements en temps reel...");

  contract.on("Deposited", (user, amount, newBalance, timestamp) => {
    const tx = {
      type:       "DEPOT",
      user:       user,
      amount:     ethers.formatEther(amount),
      newBalance: ethers.formatEther(newBalance),
      timestamp:  Number(timestamp),
      date:       new Date(Number(timestamp) * 1000).toISOString(),
    };
    transactions.unshift(tx);
    console.log(`✅  Depot recu : ${tx.amount} ETH de ${tx.user.slice(0,8)}...`);
  });

  contract.on("Withdrawn", (user, amount, newBalance, timestamp) => {
    const tx = {
      type:       "RETRAIT",
      user:       user,
      amount:     ethers.formatEther(amount),
      newBalance: ethers.formatEther(newBalance),
      timestamp:  Number(timestamp),
      date:       new Date(Number(timestamp) * 1000).toISOString(),
    };
    transactions.unshift(tx);
    console.log(`💸  Retrait recu : ${tx.amount} ETH de ${tx.user.slice(0,8)}...`);
  });

  contract.on("Transferred", (from, to, amount, timestamp) => {
    const tx = {
      type:      "TRANSFERT",
      from:      from,
      to:        to,
      amount:    ethers.formatEther(amount),
      timestamp: Number(timestamp),
      date:      new Date(Number(timestamp) * 1000).toISOString(),
    };
    transactions.unshift(tx);
    console.log(`🔄  Transfert : ${tx.amount} ETH de ${tx.from.slice(0,8)}... vers ${tx.to.slice(0,8)}...`);
  });

  await loadHistory(contract, provider);
}

async function loadHistory(contract, provider) {
  try {
    const latestBlock = await provider.getBlockNumber();
    const fromBlock   = Math.max(0, latestBlock - 1000);

    console.log(`📂  Chargement de l'historique (blocs ${fromBlock} -> ${latestBlock})...`);

    const depositFilter   = contract.filters.Deposited();
    const withdrawFilter  = contract.filters.Withdrawn();
    const transferFilter  = contract.filters.Transferred();

    const [deposits, withdrawals, transfers] = await Promise.all([
      contract.queryFilter(depositFilter,  fromBlock, latestBlock),
      contract.queryFilter(withdrawFilter, fromBlock, latestBlock),
      contract.queryFilter(transferFilter, fromBlock, latestBlock),
    ]);

    deposits.forEach((e) => transactions.push({
      type:       "DEPOT",
      user:       e.args.user,
      amount:     ethers.formatEther(e.args.amount),
      newBalance: ethers.formatEther(e.args.newBalance),
      timestamp:  Number(e.args.timestamp),
      date:       new Date(Number(e.args.timestamp) * 1000).toISOString(),
      txHash:     e.transactionHash,
    }));

    withdrawals.forEach((e) => transactions.push({
      type:       "RETRAIT",
      user:       e.args.user,
      amount:     ethers.formatEther(e.args.amount),
      newBalance: ethers.formatEther(e.args.newBalance),
      timestamp:  Number(e.args.timestamp),
      date:       new Date(Number(e.args.timestamp) * 1000).toISOString(),
      txHash:     e.transactionHash,
    }));

    transfers.forEach((e) => transactions.push({
      type:      "TRANSFERT",
      from:      e.args.from,
      to:        e.args.to,
      amount:    ethers.formatEther(e.args.amount),
      timestamp: Number(e.args.timestamp),
      date:      new Date(Number(e.args.timestamp) * 1000).toISOString(),
      txHash:    e.transactionHash,
    }));

    transactions.sort((a, b) => b.timestamp - a.timestamp);
    console.log(`✅  ${transactions.length} transactions chargees depuis l'historique`);

  } catch (err) {
    console.error("Erreur chargement historique :", err.message);
  }
}

module.exports = { startIndexer, transactions };
