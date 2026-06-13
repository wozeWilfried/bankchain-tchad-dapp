import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

const TX_GAS_LIMIT = 300000;

export function useContract(signer, provider, account) {
  const [balance, setBalance]   = useState("0");
  const [balanceFcfa, setBalanceFcfa] = useState("0");
  const [stats, setStats]       = useState({ totalDeposits: "0", txCount: "0" });
  const [loading, setLoading]   = useState(false);
  const [txHash, setTxHash]     = useState(null);
  const [error, setError]       = useState(null);

  const readContract = provider
    ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    : null;

  const writeContract = signer
    ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    : null;

  const refresh = useCallback(async () => {
    if (!readContract || !account) return;
    try {
      const bal = await readContract.getBalance(account);
      const [totalDep, txCount] = await readContract.getStats();
      const balEth = ethers.formatEther(bal);
      setBalance(balEth);
      setBalanceFcfa((parseFloat(balEth) * 4000).toFixed(2));
      setStats({
        totalDeposits: ethers.formatEther(totalDep),
        txCount: txCount.toString(),
      });
    } catch (err) {
      console.error("Erreur de lecture :", err);
    }
  }, [readContract, account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const execTx = useCallback(async (txFn) => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const tx = await txFn();
      setTxHash(tx.hash);
      await tx.wait();
      await refresh();
    } catch (err) {
      if (err.code === "CALL_EXCEPTION") {
        setError("Transaction rejetee. Verifie ton solde ETH et reessaye.");
      } else {
        setError(err.reason || err.message || "Transaction echouee");
      }
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const deposit = useCallback(async (amountEth) => {
    if (!writeContract) return;
    await execTx(() => writeContract.deposit({
      value: ethers.parseEther(amountEth),
      gasLimit: TX_GAS_LIMIT,
    }));
  }, [writeContract, execTx]);

  const withdraw = useCallback(async (amountEth) => {
    if (!writeContract) return;
    await execTx(() => writeContract.withdraw(ethers.parseEther(amountEth), {
      gasLimit: TX_GAS_LIMIT,
    }));
  }, [writeContract, execTx]);

  const transferTo = useCallback(async (to, amountEth) => {
    if (!writeContract) return;
    await execTx(() => writeContract.transfer(to, ethers.parseEther(amountEth), {
      gasLimit: TX_GAS_LIMIT,
    }));
  }, [writeContract, execTx]);

  return { balance, balanceFcfa, stats, loading, txHash, error, deposit, withdraw, transferTo, refresh };
}
