import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CHAIN_ID } from "../config/contract";

export function useWallet() {
  const [account, setAccount]   = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner]     = useState(null);
  const [chainId, setChainId]   = useState(null);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) connect();
      });
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccountsChanged = (accounts) => {
      if (accounts.length === 0) disconnect();
      else setAccount(accounts[0]);
    };
    const onChainChanged = () => window.location.reload();
    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask non detecte. Installe MetaMask : https://metamask.io");
      throw new Error("MetaMask non detecte");
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer   = await _provider.getSigner();
      const network   = await _provider.getNetwork();

      if (Number(network.chainId) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch {
          setError("Passe sur le reseau Sepolia dans MetaMask");
          throw new Error("Mauvais reseau");
        }
      }

      setProvider(_provider);
      setSigner(_signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err) {
      const msg = err.message || "Connexion refusee";
      setError(msg);
      throw err;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  }, []);

  return { account, provider, signer, chainId, error, connect, disconnect };
}
