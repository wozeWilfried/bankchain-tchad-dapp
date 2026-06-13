import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins, faArrowUp, faArrowDown, faPaperPlane,
  faWallet, faArrowRight, faCircleCheck,
  faTriangleExclamation, faCircleInfo, faClose,
  faSpinner, faArrowUpRightFromSquare, faBarsProgress,
  faHandHoldingDollar, faGlobeAfrica, faShieldHalved,
  faMoneyBillWave, faChartLine, faUsers, faLandmark,
  faEye, faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../context/AppContext";
import { TransferIllustration } from "./Illustrations";

const FCFA = new Intl.NumberFormat("fr-FR", { style: "decimal", maximumFractionDigits: 0 });
const ETH = (v) => parseFloat(v).toFixed(6);
const FCFA_FMT = (v) => FCFA.format(parseFloat(v || "0") * 4000) + " FCFA";

const FEATURES = [
  { icon: faGlobeAfrica, text: "Leader africain de la fintech blockchain" },
  { icon: faShieldHalved, text: "Transactions sécurisées par Ethereum" },
  { icon: faMoneyBillWave, text: "Transferts d'argent instantanés en FCFA" },
];

export default function Dashboard({ balance, balanceFcfa, stats, loading, txHash, error, onDeposit, onWithdraw, onTransfer }) {
  const { balanceVisible, toggleBalance } = useApp();
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [transferAddr, setTransferAddr] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [showFeatures, setShowFeatures] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "deposit") onDeposit(depositAmt);
    if (activeTab === "withdraw") onWithdraw(withdrawAmt);
    if (activeTab === "transfer") onTransfer(transferAddr, transferAmt);
  };

  const getFcfaPreview = () => {
    if (activeTab === "deposit") return depositAmt ? `${FCFA.format(fcfaFromEth(depositAmt))} FCFA` : "";
    if (activeTab === "withdraw") return withdrawAmt ? `${FCFA.format(fcfaFromEth(withdrawAmt))} FCFA` : "";
    return transferAmt ? `${FCFA.format(fcfaFromEth(transferAmt))} FCFA` : "";
  };

  const fcfaFromEth = (val) => parseFloat(val || "0") * 4000;

  return (
    <div className="space-y-5 fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: faUsers, val: stats.txCount, label: "Transactions", color: "text-emerald-500" },
          { icon: faLandmark, val: FCFA.format(fcfaFromEth(stats.totalDeposits)) + " FCFA", label: "Total déposé", color: "text-blue-500" },
          { icon: faChartLine, val: ETH(balance) + " ETH", label: "Solde ETH", color: "text-amber-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white/90 rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <FontAwesomeIcon icon={s.icon} className={`${s.color} text-lg mb-1`} />
            <p className="text-lg font-bold text-gray-800 truncate">{s.val}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-emerald-100 text-sm font-medium">
              <FontAwesomeIcon icon={faWallet} className="mr-2" />
              Solde disponible
            </p>
            <div className="flex items-center gap-2">
              <button onClick={toggleBalance}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition"
                title={balanceVisible ? "Masquer le solde" : "Afficher le solde"}>
                <FontAwesomeIcon icon={balanceVisible ? faEyeSlash : faEye} className="text-white/80 text-sm" />
              </button>
              <div className="bg-white/20 rounded-xl px-3 py-1.5 backdrop-blur-sm">
                <FontAwesomeIcon icon={faCoins} className="mr-1 text-xs" />
                <span className="text-xs text-white/80">Compte BankChain</span>
              </div>
            </div>
          </div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight mb-1 drop-shadow-sm transition-all duration-300">
            {balanceVisible ? FCFA_FMT(balanceFcfa) : "•••••••••"}
          </p>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBarsProgress} className="text-emerald-200 text-sm" />
            <p className="text-emerald-100 text-sm transition-all duration-300">
              {balanceVisible ? `${ETH(balance)} ETH` : "••••••••"}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      {showFeatures && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 slide-up backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FontAwesomeIcon icon={f.icon} className="text-amber-600 w-5" />
                  <span className="text-sm text-amber-800">{f.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowFeatures(false)} className="text-amber-400 hover:text-amber-600 p-1">
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white/90 rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 z-0 opacity-[0.04] pointer-events-none hidden sm:block">
          <TransferIllustration className="w-[260px] h-[140px]" />
        </div>
        <div className="relative z-10">
        <div className="flex gap-1 mb-6 bg-gray-100 p-1.5 rounded-xl">
          {[
            { id: "deposit", label: "Déposer", icon: faArrowDown },
            { id: "withdraw", label: "Retirer", icon: faArrowUp },
            { id: "transfer", label: "Transférer", icon: faPaperPlane },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}>
              <FontAwesomeIcon icon={tab.icon} className="mr-1.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "transfer" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
                Adresse du destinataire
              </label>
              <input type="text" placeholder="0x..." value={transferAddr}
                onChange={(e) => setTransferAddr(e.target.value)}
                className="input-field font-mono text-sm" required />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              <FontAwesomeIcon icon={faCoins} className="mr-1" />
              Montant en ETH
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.00"
              value={activeTab === "deposit" ? depositAmt : activeTab === "withdraw" ? withdrawAmt : transferAmt}
              onChange={(e) => {
                const v = e.target.value;
                if (activeTab === "deposit") setDepositAmt(v);
                else if (activeTab === "withdraw") setWithdrawAmt(v);
                else setTransferAmt(v);
              }}
              className="input-field text-lg font-semibold"
              required
            />
            {getFcfaPreview() && (
              <p className="text-right text-sm text-emerald-600 font-medium mt-1">
                <FontAwesomeIcon icon={faHandHoldingDollar} className="mr-1" />
                ~ {getFcfaPreview()}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-4 text-base">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                Confirmation en cours...
              </span>
            ) : (
              { deposit: "Déposer sur mon compte", withdraw: "Retirer de mon compte", transfer: "Envoyer les fonds" }[activeTab]
            )}
          </button>
        </form>

        {/* Success */}
        {txHash && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl slide-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-lg" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800">Transaction confirmée !</p>
                <p className="text-xs text-emerald-600">Visible sur la blockchain</p>
              </div>
            </div>
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 font-medium text-sm transition border border-emerald-200">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              Voir sur Etherscan
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-lg" />
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Rate info */}
      <div className="text-center text-xs text-gray-400 py-2">
        <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
        Taux de change indicatif : 1 ETH ≈ 4 000 FCFA &middot; Réseau Sepolia
      </div>
    </div>
  );
}
