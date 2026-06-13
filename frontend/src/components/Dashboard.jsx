import { useState } from "react";

export default function Dashboard({ balance, stats, loading, txHash, error, onDeposit, onWithdraw, onTransfer }) {
  const [depositAmt, setDepositAmt]   = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [transferTo, setTransferTo]   = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [activeTab, setActiveTab]     = useState("deposit");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "deposit")  onDeposit(depositAmt);
    if (activeTab === "withdraw") onWithdraw(withdrawAmt);
    if (activeTab === "transfer") onTransfer(transferTo, transferAmt);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <p className="text-gray-400 text-sm mb-1">Mon solde dans le contrat</p>
        <p className="text-4xl font-bold text-white">{parseFloat(balance).toFixed(6)} <span className="text-blue-400">ETH</span></p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Total depose</p>
          <p className="text-xl font-semibold">{parseFloat(stats.totalDeposits).toFixed(4)} ETH</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Transactions</p>
          <p className="text-xl font-semibold">{stats.txCount}</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-lg">
          {["deposit", "withdraw", "transfer"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "deposit" ? "Deposer" : tab === "withdraw" ? "Retirer" : "Transferer"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "transfer" && (
            <input
              type="text"
              placeholder="Adresse destinataire (0x...)"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
              required
            />
          )}

          <input
            type="number"
            step="0.001"
            min="0.001"
            placeholder="Montant en ETH"
            value={
              activeTab === "deposit" ? depositAmt :
              activeTab === "withdraw" ? withdrawAmt : transferAmt
            }
            onChange={(e) => {
              if (activeTab === "deposit")  setDepositAmt(e.target.value);
              if (activeTab === "withdraw") setWithdrawAmt(e.target.value);
              if (activeTab === "transfer") setTransferAmt(e.target.value);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Transaction en cours..." : (
              activeTab === "deposit" ? "Deposer" :
              activeTab === "withdraw" ? "Retirer" : "Envoyer"
            )}
          </button>
        </form>

        {txHash && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-lg">
            <p className="text-green-400 text-sm font-semibold mb-1">✅ Transaction confirmee !</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs font-mono break-all underline"
            >
              Voir sur Etherscan -> {txHash.slice(0, 20)}...
            </a>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
