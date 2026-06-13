export default function LoginPage({ onConnect, error }) {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-md w-full fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bank-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BankChain Tchad</h1>
          <p className="text-gray-500 text-sm">La banque blockchain pour l'Afrique</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 mb-8 border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Securise par Ethereum</p>
              <p className="text-xs text-emerald-600">Reseau Sepolia Testnet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
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
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Se connecter avec MetaMask
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          BankChain Tchad &mdash; Memoire IUEs/INSAM 2026
        </p>
      </div>
    </div>
  );
}
