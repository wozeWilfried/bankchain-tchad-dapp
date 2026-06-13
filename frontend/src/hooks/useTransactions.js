import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

const RPCS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc.sepolia.org",
  "https://sepolia.gateway.tenderly.co",
  "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
];

const CACHE_KEY = "bankchain_txs_cache_v2";
const CACHE_TTL = 120000;

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { data, time } = JSON.parse(raw);
      if (Date.now() - time < CACHE_TTL) return data;
    }
  } catch {}
  return null;
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: Date.now() }));
  } catch {}
}

async function tryFetch(account) {
  let lastErr;
  for (const rpc of RPCS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc, 11155111, { staticNetwork: true });
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 1000);

      const [deposits, withdrawals, transfers] = await Promise.all([
        contract.queryFilter(contract.filters.Deposited(), fromBlock, latestBlock),
        contract.queryFilter(contract.filters.Withdrawn(), fromBlock, latestBlock),
        contract.queryFilter(contract.filters.Transferred(), fromBlock, latestBlock),
      ]);

      const list = [];
      const pushTx = (type, e, fields) => {
        const tx = { type, date: new Date(Number(e.args.timestamp) * 1000).toISOString(), timestamp: Number(e.args.timestamp), txHash: e.transactionHash };
        if (type === "TRANSFERT") {
          tx.from = e.args.from;
          tx.to = e.args.to;
          tx.amount = ethers.formatEther(e.args.amount);
        } else {
          tx.user = e.args.user;
          tx.amount = ethers.formatEther(e.args.amount);
          tx.newBalance = ethers.formatEther(e.args.newBalance);
        }
        list.push(tx);
      };
      deposits.forEach((e) => pushTx("DEPOT", e));
      withdrawals.forEach((e) => pushTx("RETRAIT", e));
      transfers.forEach((e) => pushTx("TRANSFERT", e));
      list.sort((a, b) => b.timestamp - a.timestamp);
      return list;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("Tous les RPC ont échoué");
}

export function useTransactions(account) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cached = loadCache();
    if (cached) {
      setTxs(cached);
      setLoading(false);
    }

    try {
      const list = await tryFetch(account);
      setTxs(list);
      saveCache(list);
      setError(null);
    } catch (err) {
      console.error("Erreur historique:", err.message);
      if (!cached) setError("Impossible de charger l'historique. Vérifie ta connexion Internet.");
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => { fetchTxs(); }, [fetchTxs]);

  const filtered = account
    ? txs.filter((tx) => {
        const addr = account.toLowerCase();
        return (tx.user?.toLowerCase() === addr) ||
               (tx.from?.toLowerCase() === addr) ||
               (tx.to?.toLowerCase() === addr);
      })
    : txs;

  return { txs: filtered, allTxs: txs, loading, error, refresh: fetchTxs };
}
