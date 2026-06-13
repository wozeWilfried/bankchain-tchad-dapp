import { useState } from "react";

const FCFA_FORMAT = new Intl.NumberFormat("fr-FR", { style: "decimal", maximumFractionDigits: 0 });
const ETH_FORMAT = (v) => parseFloat(v).toFixed(6);

const AF_FACTS = [
  { icon: "🌍", text: "Leader africain de la fintech blockchain" },
  { icon: "🔒", text: "Transactions securisees par Ethereum" },
  { icon: "⚡", text: "Transferts instantanes en FCFA" },
];

export default function Dashboard({ balance, balanceFcfa, stats, loading, txHash, error, onDeposit, onWithdraw, onTransfer }) {
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [transferAddr, setTransferAddr] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [showFacts, setShowFacts] = useState(true);

  const formatFcfa = (val) => FCFA_FORMAT.format(parseFloat(val || "0")) + " FCFA";
  const fcfaFromEth = (eth) => (parseFloat(eth || "0") * 4000);
  const ethFromFcfa = (fcfa) => (parseFloat(fcfa || "0") / 4000);

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
      {/* Carte solde principale */}
      <div className="bank-gradient rounded-3xl p-6 md:p-8 text-white relative overflow-hidden" style={{ boxShadow: '0 12px 40px rgba(5,150,105,0.3)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Solde disponible</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-1.5">
              <p className="text-xs text-white/80">Compte BancChain</p>
            </div>
          </div>

          <div className="mb-1">
            <p className="text-4xl md:text-5xl font-bold tracking-tight">
              {formatFcfa(balanceFcfa)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            </svg>
            <p className="text-emerald-100 text-sm">{ETH_FORMAT(balance)} ETH</p>
          </div>

          {/* Stats en ligne */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-emerald-200 text-xs">Total depose</p>
              <p className="text-white font-semibold text-sm">{FCFA_FORMAT.format(fcfaFromEth(stats.totalDeposits))} FCFA</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-emerald-200 text-xs">Transactions</p>
              <p className="text-white font-semibold text-sm">{stats.txCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Afrique facts */}
      {showFacts && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start justify-between slide-up">
          <div className="space-y-2">
            {AF_FACTS.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm text-amber-800">{f.text}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowFacts(false)} className="text-amber-400 hover:text-amber-600 text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Actions */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex gap-1 mb-6 bg-gray-100 p-1.5 rounded-xl">
          {[
            { id: "deposit", label: "Deposer", icon: "💰" },
            { id: "withdraw", label: "Retirer", icon: "💸" },
            { id: "transfer", label: "Transferer", icon: "📤" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "transfer" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Adresse du destinataire</label>
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
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Confirmation en cours...
              </span>
            ) : (
              {
                deposit: "Deposer sur mon compte",
                withdraw: "Retirer de mon compte",
                transfer: "Envoyer les fonds",
              }[activeTab]
            )}
          </button>
        </form>

        {/* Tx success */}
        {txHash && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-emerald-800">Transaction confirmee !</p>
                <p className="text-xs text-emerald-600">Visible sur la blockchain</p>
              </div>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Voir sur Etherscan
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-400 py-4">
        <p>Taux de change indicatif : 1 ETH ≈ 4 000 FCFA</p>
        <p className="mt-1">Reseau Sepolia &mdash; Utilise des ETH de test</p>
      </div>
    </div>
  );
}
