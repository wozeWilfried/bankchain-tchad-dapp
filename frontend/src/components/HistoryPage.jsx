import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft, faArrowUp, faArrowDown, faPaperPlane,
  faMagnifyingGlass, faRotate, faArrowUpRightFromSquare,
  faSpinner, faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useTransactions } from "../hooks/useTransactions";

export default function HistoryPage({ account }) {
  const { txs, loading, error, refresh } = useTransactions(account);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = txs.filter((tx) => {
    if (filter !== "all" && tx.type !== filter.toUpperCase()) return false;
    if (search) {
      const s = search.toLowerCase();
      return (tx.user?.toLowerCase().includes(s)) ||
             (tx.from?.toLowerCase().includes(s)) ||
             (tx.to?.toLowerCase().includes(s)) ||
             tx.amount?.includes(s);
    }
    return true;
  });

  const fmtDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const short = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const getIcon = (type) => {
    if (type === "DEPOT") return faArrowDown;
    if (type === "RETRAIT") return faArrowUp;
    return faPaperPlane;
  };

  const getStyle = (type) => {
    if (type === "DEPOT") return "border-emerald-200 bg-emerald-50/50";
    if (type === "RETRAIT") return "border-red-200 bg-red-50/50";
    return "border-blue-200 bg-blue-50/50";
  };

  const getLabel = (type) => {
    if (type === "DEPOT") return { text: "Dépôt", color: "text-emerald-700 bg-emerald-100" };
    if (type === "RETRAIT") return { text: "Retrait", color: "text-red-700 bg-red-100" };
    return { text: "Transfert", color: "text-blue-700 bg-blue-100" };
  };

  return (
    <div className="bg-white/90 rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shadow-md shrink-0">
            <FontAwesomeIcon icon={faClockRotateLeft} className="text-white text-sm sm:text-base" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Historique</h2>
            <p className="text-[10px] sm:text-xs text-gray-400">Transactions on-chain</p>
          </div>
        </div>
        <button onClick={refresh} className="text-gray-400 hover:text-emerald-600 transition p-1.5 sm:p-2 rounded-lg hover:bg-emerald-50" title="Actualiser">
          <FontAwesomeIcon icon={loading ? faSpinner : faRotate} spin={loading} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-1 overflow-x-auto">
          {[
            { id: "all", label: "Tout" },
            { id: "DEPOT", label: "Dépôts" },
            { id: "RETRAIT", label: "Retraits" },
            { id: "TRANSFERT", label: "Transferts" },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition whitespace-nowrap ${
                filter === f.id ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-44">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-5">
        {[
          { label: "Dépôts", count: txs.filter(t => t.type === "DEPOT").length, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { label: "Retraits", count: txs.filter(t => t.type === "RETRAIT").length, color: "text-red-600 bg-red-50 border-red-200" },
          { label: "Transferts", count: txs.filter(t => t.type === "TRANSFERT").length, color: "text-blue-600 bg-blue-50 border-blue-200" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-2 sm:p-3 text-center border ${s.color}`}>
            <p className="text-base sm:text-lg font-bold">{s.count}</p>
            <p className="text-[10px] sm:text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 sm:py-12">
          <FontAwesomeIcon icon={faSpinner} spin className="text-emerald-500 text-xl sm:text-2xl" />
          <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">Chargement des transactions depuis la blockchain...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faReceipt} className="text-amber-400 text-xl sm:text-2xl" />
          </div>
          <p className="text-sm sm:text-base text-amber-700 font-medium">{error}</p>
          <button onClick={refresh} className="mt-3 text-xs text-amber-600 hover:text-amber-700 underline underline-offset-2">
            <FontAwesomeIcon icon={faRotate} className="mr-1" />
            Réessayer
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faReceipt} className="text-gray-300 text-xl sm:text-2xl" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 font-medium">Aucune transaction</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Effectue un dépôt ou un transfert pour voir l'historique</p>
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2 sm:space-y-2.5 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1 -mr-1">
          {filtered.map((tx, i) => {
            const lbl = getLabel(tx.type);
            return (
              <div key={i} className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border ${getStyle(tx.type)} slide-up`}
                style={{ animationDelay: `${i * 25}ms` }}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.type === "DEPOT" ? "bg-emerald-100 text-emerald-600" :
                  tx.type === "RETRAIT" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                }`}>
                  <FontAwesomeIcon icon={getIcon(tx.type)} className="text-xs sm:text-sm" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                    <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-semibold ${lbl.color}`}>{lbl.text}</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">{fmtDate(tx.date)}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {tx.user && <span className="font-mono">{short(tx.user)}</span>}
                    {tx.from && <span className="font-mono">{short(tx.from)} → {short(tx.to)}</span>}
                  </div>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  <p className={`text-xs sm:text-sm font-bold ${tx.type === "RETRAIT" ? "text-red-500" : "text-emerald-600"}`}>
                    {tx.type === "RETRAIT" ? "−" : "+"}{parseFloat(tx.amount).toFixed(4)}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400">~{(parseFloat(tx.amount) * 4000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA</p>
                </div>

                <div className="flex flex-col gap-1 shrink-0 min-w-0 sm:min-w-[80px]">
                  {tx.type === "RETRAIT" && (
                    <span className="text-xs sm:hidden font-bold text-red-500">−{parseFloat(tx.amount).toFixed(4)}</span>
                  )}
                  {(tx.type === "DEPOT" || tx.type === "TRANSFERT") && (
                    <span className="text-xs sm:hidden font-bold text-emerald-600">+{parseFloat(tx.amount).toFixed(4)}</span>
                  )}
                  {tx.txHash ? (
                    <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition font-medium whitespace-nowrap">
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[7px] sm:text-[8px]" />
                      <span className="hidden sm:inline">Etherscan</span>
                      <span className="sm:hidden">Scan</span>
                    </a>
                  ) : (
                    <span className="text-[9px] text-gray-300 italic">En attente</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && txs.length > 0 && (
        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
          <p className="text-[10px] sm:text-xs text-gray-400">
            <FontAwesomeIcon icon={faReceipt} className="mr-1" />
            {txs.length} transaction(s)
          </p>
          <button onClick={refresh} className="text-[9px] sm:text-[10px] text-gray-300 hover:text-emerald-500 transition">
            <FontAwesomeIcon icon={faRotate} className="mr-1" />
            Actualiser
          </button>
        </div>
      )}
    </div>
  );
}
