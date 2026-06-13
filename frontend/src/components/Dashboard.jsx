import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins, faArrowUp, faArrowDown, faPaperPlane,
  faWallet, faArrowRight, faExchangeAlt, faCircleCheck,
  faTriangleExclamation, faClose, faCircleInfo,
  faSpinner, faArrowUpRightFromSquare, faBarsProgress,
  faHandHoldingDollar, faGlobeAfrica, faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

const FCFA_FORMAT = new Intl.NumberFormat("fr-FR", { style: "decimal", maximumFractionDigits: 0 });
const ETH_FORMAT = (v) => parseFloat(v).toFixed(6);

const FEATURES = [
  { icon: faGlobeAfrica, text: "Leader africain de la fintech blockchain" },
  { icon: faShieldHalved, text: "Transactions sécurisées par Ethereum" },
  { icon: null, text: "Transferts d'argent instantanés en FCFA" },
];

export default function Dashboard({ balance, balanceFcfa, stats, loading, txHash, error, onDeposit, onWithdraw, onTransfer }) {
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [transferAddr, setTransferAddr] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [showFeatures, setShowFeatures] = useState(true);

  const formatFcfa = (val) => FCFA_FORMAT.format(parseFloat(val || "0")) + " FCFA";
  const fcfaFromEth = (eth) => (parseFloat(eth || "0") * 4000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "deposit") onDeposit(depositAmt);
    if (activeTab === "withdraw") onWithdraw(withdrawAmt);
    if (activeTab === "transfer") onTransfer(transferAddr, transferAmt);
  };

  const getFcfaPreview = () => {
    if (activeTab === "deposit") return depositAmt ? `${FCFA_FORMAT.format(fcfaFromEth(depositAmt))} FCFA` : "";
    if (activeTab === "withdraw") return withdrawAmt ? `${FCFA_FORMAT.format(fcfaFromEth(withdrawAmt))} FCFA` : "";
    return transferAmt ? `${FCFA_FORMAT.format(fcfaFromEth(transferAmt))} FCFA` : "";
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Balance card */}
      <div className="bank-gradient rounded-3xl p-6 md:p-8 text-white relative overflow-hidden" style={{ boxShadow: '0 12px 40px rgba(5,150,105,0.3)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Solde disponible
              </p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-1.5">
              <p className="text-xs text-white/80">
                <FontAwesomeIcon icon={faCoins} className="mr-1" />
                Compte BankChain
              </p>
            </div>
          </div>

          <p className="text-4xl md:text-5xl font-bold tracking-tight mb-1">
            {formatFcfa(balanceFcfa)}
          </p>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBarsProgress} className="text-emerald-200 text-sm" />
            <p className="text-emerald-100 text-sm">{ETH_FORMAT(balance)} ETH</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-emerald-200 text-xs">
                <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                Total déposé
              </p>
              <p className="text-white font-semibold text-sm">{FCFA_FORMAT.format(fcfaFromEth(stats.totalDeposits))} FCFA</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-emerald-200 text-xs">
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-1" />
                Transactions
              </p>
              <p className="text-white font-semibold text-sm">{stats.txCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      {showFeatures && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 slide-up">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  {f.icon && <FontAwesomeIcon icon={f.icon} className="text-amber-600 w-5" />}
                  {!f.icon && <span className="w-5" />}
                  <span className="text-sm text-amber-800">{f.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowFeatures(false)} className="text-amber-400 hover:text-amber-600">
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex gap-1 mb-6 bg-gray-100 p-1.5 rounded-xl">
          {[
            { id: "deposit", label: "Déposer", icon: faArrowDown },
            { id: "withdraw", label: "Retirer", icon: faArrowUp },
            { id: "transfer", label: "Transférer", icon: faPaperPlane },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
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
              <input
                type="text"
                placeholder="0x..."
                value={transferAddr}
                onChange={(e) => setTransferAddr(e.target.value)}
                className="input-field font-mono text-sm"
                required
              />
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
              value={
                activeTab === "deposit" ? depositAmt :
                activeTab === "withdraw" ? withdrawAmt : transferAmt
              }
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-4 text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                Confirmation en cours...
              </span>
            ) : (
              {
                deposit: "Déposer sur mon compte",
                withdraw: "Retirer de mon compte",
                transfer: "Envoyer les fonds",
              }[activeTab]
            )}
          </button>
        </form>

        {/* Success */}
        {txHash && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-lg" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800">Transaction confirmée !</p>
                <p className="text-xs text-emerald-600">Visible sur la blockchain</p>
              </div>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
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

      <div className="text-center text-xs text-gray-400 py-4">
        <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
        Taux de change indicatif : 1 ETH ≈ 4 000 FCFA &middot; Réseau Sepolia
      </div>
    </div>
  );
}
