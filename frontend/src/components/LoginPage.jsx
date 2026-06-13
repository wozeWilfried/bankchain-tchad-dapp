import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faShieldHalved, faArrowRightToBracket, faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faMeta } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage({ onConnect, error, onBack }) {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-md w-full fade-in">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 mb-4 transition">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Changer de compte
          </button>
        )}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bank-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}>
            <FontAwesomeIcon icon={faCoins} className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BankChain Tchad</h1>
          <p className="text-gray-500 text-sm">La banque blockchain pour l'Afrique</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 mb-8 border border-emerald-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Sécurisé par Ethereum</p>
              <p className="text-xs text-emerald-600">Réseau Sepolia Testnet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Transactions en FCFA</p>
              <p className="text-xs text-emerald-600">Taux: 1 ETH ≈ 4 000 FCFA</p>
            </div>
          </div>
        </div>

        <button
          onClick={onConnect}
          className="btn-primary py-4 text-lg flex items-center justify-center gap-3"
        >
          <FontAwesomeIcon icon={faMeta} className="text-xl" />
          Se connecter avec MetaMask
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          BankChain Tchad &mdash; Mémoire IUEs/INSAM 2026
        </p>
      </div>
    </div>
  );
}
