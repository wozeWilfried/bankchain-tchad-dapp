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
      {/* Navbar */}
      <nav className="glass-nav px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bank-gradient rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">BankChain Tchad</h1>
              <p className="text-xs text-gray-500">Compte blockchain</p>
            </div>
          </div>
          <ConnectWallet
            account={account}
            onDisconnect={disconnect}
          />
        </div>
      </nav>

      {/* Dashboard */}
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
