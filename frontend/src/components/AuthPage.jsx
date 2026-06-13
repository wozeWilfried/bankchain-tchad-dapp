import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMeta } from "@fortawesome/free-brands-svg-icons";
import {
  faCoins, faEnvelope, faLock, faRightToBracket,
  faEye, faEyeSlash, faSpinner, faShieldHalved, faCheckCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { WalletIllustration, ShieldIllustration } from "./Illustrations";

export default function AuthPage({ onLogin, error, onConnectMetaMask }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) {
      setLocalError("Email et mot de passe requis");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onLogin(email, password);
      setLoading(false);
    }, 400);
  };

  const quickFill = (e, p) => {
    setEmail(e);
    setPassword(p);
    setLocalError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-700 to-green-500">
      {/* Pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.07]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 10H40v10h10V10zM30 10H20v10h10V10zM10 30H0v10h10V30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>
      {/* Decorative background illustrations */}
      <div className="absolute left-0 bottom-0 z-0 opacity-[0.08] pointer-events-none hidden lg:block">
        <WalletIllustration className="w-[400px] h-[240px]" />
      </div>
      <div className="absolute right-0 top-0 z-0 opacity-[0.06] pointer-events-none hidden lg:block scale-x-[-1]">
        <ShieldIllustration className="w-[240px] h-[280px]" />
      </div>
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl fade-in border border-white/20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <FontAwesomeIcon icon={faCoins} className="text-white text-2xl sm:text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">BankChain Tchad</h1>
          <p className="text-xs sm:text-sm text-gray-500">La banque blockchain pour l'Afrique</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
              Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@bankchain.td" className="input-field text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              <FontAwesomeIcon icon={faLock} className="mr-1" />
              Mot de passe
            </label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="input-field pr-10 text-sm" required />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={showPwd ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-3 sm:py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base">
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faRightToBracket} /> Se connecter</>}
          </button>
        </form>

        {(error || localError) && (
          <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-xs text-center">{error || localError}</p>
          </div>
        )}

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-800 text-center mb-2 sm:mb-3">Comptes de démonstration</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button type="button" onClick={() => quickFill("admin@bankchain.td", "admin123")}
              className="p-2 sm:p-2.5 bg-white rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition">
              <FontAwesomeIcon icon={faUser} className="mr-1 text-emerald-500" />
              <span className="font-medium">Admin</span>
              <p className="text-[10px] opacity-70 truncate mt-0.5">admin@bankchain.td</p>
            </button>
            <button type="button" onClick={() => quickFill("user@bankchain.td", "user123")}
              className="p-2 sm:p-2.5 bg-white rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition">
              <FontAwesomeIcon icon={faUser} className="mr-1 text-emerald-500" />
              <span className="font-medium">User</span>
              <p className="text-[10px] opacity-70 truncate mt-0.5">user@bankchain.td</p>
            </button>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 bg-amber-50 rounded-2xl p-3 sm:p-4 border border-amber-100 space-y-2">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-amber-600 w-4" />
            <span className="text-xs text-amber-800">Sécurisé par Ethereum Sepolia</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-amber-600 w-4" />
            <span className="text-xs text-amber-800">Transactions en FCFA (1 ETH ≈ 4 000 FCFA)</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <button onClick={onConnectMetaMask} disabled={loading}
            className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 disabled:opacity-50">
            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-1" /> : <FontAwesomeIcon icon={faMeta} className="mr-1 text-sm" />}
            {loading ? "Connexion..." : "Ou connecter MetaMask directement"}
          </button>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-4 sm:mt-6">
          BankChain Tchad &mdash; Mémoire IUEs/INSAM 2026
        </p>
      </div>
    </div>
  );
}
