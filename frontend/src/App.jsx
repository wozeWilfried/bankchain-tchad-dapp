import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import LoginPage from "./components/LoginPage";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";

export default function App() {
  const { account, provider, signer, error: walletError, connect, disconnect } = useWallet();
  const { balance, balanceFcfa, stats, loading, txHash, error: contractError, deposit, withdraw, transferTo } =
    useContract(signer, provider, account);

  if (!account) {
    return <LoginPage onConnect={connect} error={walletError} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fef3c7 100%)" }}>
      <nav className="glass-nav px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bank-gradient rounded-xl flex items-center justify-center shadow-md">
              <FontAwesomeIcon icon={faCoins} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">BankChain Tchad</h1>
              <p className="text-xs text-gray-500">Compte blockchain</p>
            </div>
          </div>
          <ConnectWallet account={account} onDisconnect={disconnect} />
        </div>
      </nav>
      <main className="max-w-xl mx-auto px-4 py-8">
        <Dashboard
          balance={balance}
          balanceFcfa={balanceFcfa}
          stats={stats}
          loading={loading}
          txHash={txHash}
          error={contractError}
          onDeposit={deposit}
          onWithdraw={withdraw}
          onTransfer={transferTo}
        />
      </main>
    </div>
  );
}
