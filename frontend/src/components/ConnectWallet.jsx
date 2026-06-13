import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function ConnectWallet({ account, onDisconnect }) {
  const short = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
        <FontAwesomeIcon icon={faCircle} className="text-emerald-500 text-xs pulse-dot" />
        <span className="text-sm font-mono text-emerald-700 font-medium">{short(account)}</span>
      </div>
      <button
        onClick={onDisconnect}
        className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" />
        Quitter
      </button>
    </div>
  );
}
