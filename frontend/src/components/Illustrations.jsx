export function WalletIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="35" width="160" height="75" rx="12" fill="url(#wgrad)" fillOpacity="0.15" stroke="url(#wgrad)" strokeWidth="1.5" />
      <rect x="55" y="20" width="100" height="30" rx="8" fill="white" fillOpacity="0.5" stroke="#d1fae5" strokeWidth="1" />
      <rect x="70" y="28" width="30" height="6" rx="3" fill="#059669" fillOpacity="0.2" />
      <rect x="70" y="38" width="50" height="4" rx="2" fill="#059669" fillOpacity="0.15" />
      <circle cx="45" cy="72" r="12" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
      <path d="M41 72h8M45 68v8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="135" cy="72" r="10" fill="#6366f1" fillOpacity="0.1" stroke="#6366f1" strokeWidth="1" />
      <path d="M110 60l15-8 15 8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <defs><linearGradient id="wgrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#059669" /><stop offset="1" stopColor="#34d399" /></linearGradient></defs>
    </svg>
  );
}

export function ShieldIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 10L110 35v35c0 30-22 50-50 58-28-8-50-28-50-58V35L60 10z" fill="url(#sgrad)" fillOpacity="0.1" stroke="url(#sgrad)" strokeWidth="2" />
      <path d="M60 35v50M45 55h30" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <circle cx="60" cy="80" r="18" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="1.5" />
      <path d="M54 80l4 4 8-8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs><linearGradient id="sgrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#059669" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
    </svg>
  );
}

export function TransferIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="15" width="60" height="40" rx="8" fill="#e0f2fe" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="1" />
      <rect x="15" y="25" width="20" height="4" rx="2" fill="#0284c7" fillOpacity="0.2" />
      <rect x="15" y="33" width="35" height="3" rx="1.5" fill="#0284c7" fillOpacity="0.15" />
      <rect x="5" y="65" width="60" height="30" rx="8" fill="#fef3c7" fillOpacity="0.5" stroke="#f59e0b" strokeWidth="1" />
      <rect x="15" y="73" width="20" height="3" rx="1.5" fill="#d97706" fillOpacity="0.2" />

      <rect x="115" y="15" width="60" height="40" rx="8" fill="#ecfdf5" fillOpacity="0.5" stroke="#10b981" strokeWidth="1" />
      <rect x="125" y="25" width="20" height="4" rx="2" fill="#059669" fillOpacity="0.2" />
      <rect x="125" y="33" width="35" height="3" rx="1.5" fill="#059669" fillOpacity="0.15" />

      <path d="M75 55l15-15 15 15" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#10b981" fillOpacity="0.08" />
      <circle cx="90" cy="35" r="5" fill="#10b981" fillOpacity="0.2" />
      <path d="M88 35h4M90 33v4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="50" height="35" rx="6" stroke="#d1d5db" strokeWidth="1.5" fill="#f9fafb" />
      <rect x="20" y="27" width="25" height="3" rx="1.5" fill="#e5e7eb" />
      <rect x="20" y="33" width="35" height="2.5" rx="1.25" fill="#e5e7eb" />
      <rect x="55" y="28" width="50" height="35" rx="6" stroke="#d1d5db" strokeWidth="1.5" fill="#f9fafb" />
      <rect x="60" y="35" width="25" height="3" rx="1.5" fill="#e5e7eb" />
      <rect x="60" y="41" width="35" height="2.5" rx="1.25" fill="#e5e7eb" />
      <circle cx="65" cy="75" r="12" fill="#e5e7eb" fillOpacity="0.5" />
      <path d="M60 75h10M65 70v10" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M80 85l8-8" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
