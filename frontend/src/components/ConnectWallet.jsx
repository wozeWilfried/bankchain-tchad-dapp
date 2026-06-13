import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faRightFromBracket, faWallet } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";

export default function ConnectWallet({ account, onDisconnect }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const short = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 max-w-[130px] sm:max-w-none">
          <FontAwesomeIcon icon={faCircle} className="text-emerald-500 text-[6px] sm:text-xs pulse-dot" />
          <FontAwesomeIcon icon={faWallet} className="text-emerald-400 text-[9px] sm:text-xs hidden sm:block" />
          <span className="text-[10px] sm:text-sm font-mono text-emerald-700 font-medium truncate">{short(account)}</span>
        </div>
        <button onClick={() => setShowConfirm(true)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 sm:px-2 sm:py-1.5 rounded-lg hover:bg-red-50"
          title="Déconnexion">
          <FontAwesomeIcon icon={faRightFromBracket} className="text-xs sm:text-sm" />
        </button>
      </div>
      <ConfirmModal
        open={showConfirm}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter de votre portefeuille et de votre session BankChain ?"
        confirmLabel="Oui, déconnecter"
        cancelLabel="Annuler"
        onConfirm={() => { setShowConfirm(false); onDisconnect(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
