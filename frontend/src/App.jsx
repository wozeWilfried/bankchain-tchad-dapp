import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faClockRotateLeft, faGauge, faUsers as faUsersIcon } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";
import { getStoredAuth, login as authLogin, logout as authLogout } from "./config/auth";
import AuthPage from "./components/AuthPage";
import LoginPage from "./components/LoginPage";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
import HistoryPage from "./components/HistoryPage";
import UserManagement from "./components/UserManagement";

export default function App() {
  const [session, setSession] = useState(() => getStoredAuth());
  const [page, setPage] = useState("dashboard");
  const [authError, setAuthError] = useState("");

  const { account, provider, signer, error: walletError, connect, disconnect } = useWallet();
  const { balance, balanceFcfa, stats, loading, txHash, error: contractError, deposit, withdraw, transferTo, refresh } =
    useContract(signer, provider, account);

  useEffect(() => {
    if (account) refresh();
  }, [account, refresh]);

  const handleLogin = (email, password) => {
    const result = authLogin(email, password);
    if (!result) {
      setAuthError("Email ou mot de passe incorrect");
      return;
    }
    setSession(result);
  };

  const handleLogout = () => {
    authLogout();
    setSession(null);
    disconnect();
  };

  const handleMetaMaskConnect = async () => {
    setAuthError("");
    try {
      await connect();
      authLogin("admin@bankchain.td", "admin123");
      setSession(getStoredAuth());
    } catch {
      setAuthError("Connexion MetaMask annulée ou refusée");
    }
  };

  const navBtn = (id, label, labelShort, icon) => (
    <button onClick={() => setPage(id)}
      className={`px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition ${
        page === id ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}>
      <FontAwesomeIcon icon={icon} className="mr-1 hidden sm:inline" />
      <span className="sm:hidden">{labelShort}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  // Auth page
  if (!session && !account) {
    return <AuthPage onLogin={handleLogin} error={authError} onConnectMetaMask={handleMetaMaskConnect} />;
  }

  // Token exists but not connected to MetaMask
  if (session && !account) {
    return <LoginPage onConnect={connect} error={walletError} onBack={() => handleLogout()} />;
  }

  // Fully authenticated + connected
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <FontAwesomeIcon icon={faCoins} className="text-white text-sm sm:text-base" />
                </div>
                <h1 className="text-sm sm:text-base font-bold text-gray-800 truncate max-w-[80px] sm:max-w-none">
                  BankChain Tchad
                </h1>
              </div>
              <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg ml-1 overflow-x-auto">
                {navBtn("dashboard", "Tableau de bord", "Dashboard", faGauge)}
                {navBtn("users", "Utilisateurs", "Users", faUsersIcon)}
                {navBtn("history", "Historique", "Hist.", faClockRotateLeft)}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ConnectWallet account={account} onDisconnect={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {page === "history" ? (
          <HistoryPage account={account} />
        ) : page === "users" ? (
          <UserManagement provider={provider} />
        ) : (
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
            provider={provider}
          />
        )}
      </main>
    </div>
  );
}
