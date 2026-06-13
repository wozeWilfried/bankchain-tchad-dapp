import { useWallet }   from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import ConnectWallet   from "./components/ConnectWallet";
import Dashboard       from "./components/Dashboard";

export default function App() {
  const { account, provider, signer, error: walletError, connect, disconnect } = useWallet();
  const { balance, stats, loading, txHash, error: contractError, deposit, withdraw, transferTo } =
    useContract(signer, provider, account);

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">BankChain Tchad</h1>
          <p className="text-xs text-gray-500">Reseau Sepolia Testnet</p>
        </div>
        <ConnectWallet
          account={account}
          error={walletError}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      </nav>

      <main className="max-w-xl mx-auto px-4 py-10">
        {!account ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">🔐</p>
            <h2 className="text-2xl font-bold text-white mb-2">Connecte ton wallet</h2>
            <p className="text-gray-400 mb-8">
              Utilise MetaMask pour acceder a ta banque blockchain sur Sepolia.
            </p>
            <button
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition text-lg"
            >
              Connecter MetaMask
            </button>
            {walletError && <p className="text-red-400 mt-4 text-sm">{walletError}</p>}
          </div>
        ) : (
          <Dashboard
            balance={balance}
            stats={stats}
            loading={loading}
            txHash={txHash}
            error={contractError}
            onDeposit={deposit}
            onWithdraw={withdraw}
            onTransfer={transferTo}
          />
        )}
      </main>
    </div>
  );
}
