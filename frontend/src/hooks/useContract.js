import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

export function useContract(signer, provider, account) {
  const [balance, setBalance]   = useState("0");
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
      setBalance(ethers.formatEther(bal));
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

  const deposit = useCallback(async (amountEth) => {
    if (!writeContract) return;
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const tx = await writeContract.deposit({
        value: ethers.parseEther(amountEth),
      });
      setTxHash(tx.hash);
      await tx.wait();
      await refresh();
    } catch (err) {
      setError(err.reason || err.message || "Transaction echouee");
    } finally {
      setLoading(false);
    }
  }, [writeContract, refresh]);

  const withdraw = useCallback(async (amountEth) => {
    if (!writeContract) return;
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const tx = await writeContract.withdraw(ethers.parseEther(amountEth));
      setTxHash(tx.hash);
      await tx.wait();
      await refresh();
    } catch (err) {
      setError(err.reason || err.message || "Transaction echouee");
    } finally {
      setLoading(false);
    }
  }, [writeContract, refresh]);

  const transferTo = useCallback(async (to, amountEth) => {
    if (!writeContract) return;
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const tx = await writeContract.transfer(to, ethers.parseEther(amountEth));
      setTxHash(tx.hash);
      await tx.wait();
      await refresh();
    } catch (err) {
      setError(err.reason || err.message || "Transaction echouee");
    } finally {
      setLoading(false);
    }
  }, [writeContract, refresh]);

  return { balance, stats, loading, txHash, error, deposit, withdraw, transferTo, refresh };
}
