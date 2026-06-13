export default function ConnectWallet({ account, error, onConnect, onDisconnect }) {
  const short = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-green-400 font-mono">
          ● {short(account)}
        </span>
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Deconnecter
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
      >
        Connecter MetaMask
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
