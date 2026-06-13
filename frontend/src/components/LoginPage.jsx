import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faShieldHalved, faArrowRightToBracket, faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faMeta } from "@fortawesome/free-brands-svg-icons";
import { WalletIllustration, ShieldIllustration } from "./Illustrations";

export default function LoginPage({ onConnect, error, onBack }) {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>
      {/* Decorative background illustrations */}
      <div className="absolute left-4 bottom-4 z-0 opacity-[0.07] pointer-events-none hidden lg:block">
        <WalletIllustration className="w-[350px] h-[210px]" />
      </div>
      <div className="absolute right-4 top-4 z-0 opacity-[0.05] pointer-events-none hidden lg:block scale-x-[-1]">
        <ShieldIllustration className="w-[200px] h-[240px]" />
      </div>
      <div className="relative z-10 glass-card rounded-3xl p-8 md:p-12 max-w-md w-full fade-in">
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
