import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup, faCopy, faCheck, faTrashCan, faUserPlus,
  faUsers, faEnvelope, faAddressCard, faCircle,
  faSpinner, faClose, faTriangleExclamation,
  faArrowUpRightFromSquare, faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { DEMO_USERS } from "../config/demoUsers";

const STORAGE_KEY = "bankchain_custom_users";

function loadUserList() {
  const builtIn = DEMO_USERS.map((u) => ({ ...u, builtIn: true }));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    return [...builtIn, ...custom];
  } catch {
    return builtIn;
  }
}

function saveUserList(users) {
  const custom = users.filter((u) => !u.builtIn);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export default function UserManagement({ provider }) {
  const [users, setUsers] = useState(() => loadUserList());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [copied, setCopied] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(false);

  const refreshBalances = useCallback(async () => {
    setLoadingBalances(true);
    try {
      const _provider = provider || new window.ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const contract = new window.ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ["function getBalance(address) view returns (uint256)"],
        _provider
      );
      const updated = await Promise.all(
        users.map(async (u) => {
          let balance = "0";
          try {
            if (u.address && u.address.startsWith("0x") && u.address.length === 42) {
              const bal = await contract.getBalance(u.address);
              balance = window.ethers.formatEther(bal);
            }
          } catch {}
          return { ...u, balance };
        })
      );
      setUsers(updated);
      const custom = updated.filter((u) => !u.builtIn);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    } catch {}
    setLoadingBalances(false);
  }, [provider, users.length]);

  useEffect(() => { refreshBalances(); }, []);

  const copyAddr = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Nom requis";
    if (!form.email.trim()) errs.email = "Email requis";
    else if (!form.email.includes("@")) errs.email = "Email invalide";
    if (!form.address.trim()) errs.address = "Adresse requise";
    else if (!form.address.startsWith("0x") || form.address.length !== 42) errs.address = "Adresse ETH invalide (0x... 42 car.)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addUser = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      role: "Utilisateur",
      builtIn: false,
      balance: "0",
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveUserList(updated);
    setForm({ name: "", email: "", address: "" });
    setShowForm(false);
    setErrors({});
  };

  const removeUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    saveUserList(updated);
  };

  const short = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="bg-white/90 rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faUsers} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Utilisateurs</h2>
            <p className="text-xs text-gray-400">{users.length} membre(s) du réseau</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refreshBalances} disabled={loadingBalances}
            className="text-gray-400 hover:text-emerald-600 transition p-2 rounded-lg hover:bg-emerald-50" title="Actualiser les soldes">
            <FontAwesomeIcon icon={loadingBalances ? faSpinner : faShieldHalved} spin={loadingBalances} className="text-sm" />
          </button>
          <button onClick={() => { setShowForm(!showForm); setErrors({}); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition shadow-sm">
            <FontAwesomeIcon icon={faUserPlus} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-200 slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              <FontAwesomeIcon icon={faUserPlus} className="mr-1.5 text-indigo-500" />
              Nouvel utilisateur
            </span>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <form onSubmit={addUser} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                <FontAwesomeIcon icon={faUserGroup} className="mr-1" />
                Nom
              </label>
              <input type="text" placeholder="Jean Dupont" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input-field text-sm ${errors.name ? "border-red-300 ring-1 ring-red-300" : ""}`} />
              {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                Email
              </label>
              <input type="email" placeholder="jean@bankchain.td" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`input-field text-sm ${errors.email ? "border-red-300 ring-1 ring-red-300" : ""}`} />
              {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                <FontAwesomeIcon icon={faAddressCard} className="mr-1" />
                Adresse Ethereum
              </label>
              <input type="text" placeholder="0x..." value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={`input-field text-sm font-mono ${errors.address ? "border-red-300 ring-1 ring-red-300" : ""}`} />
              {errors.address && <p className="text-red-500 text-[10px] mt-0.5">{errors.address}</p>}
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white font-medium text-sm hover:bg-indigo-600 transition shadow-sm">
                <FontAwesomeIcon icon={faUserPlus} className="mr-1.5" />
                Ajouter
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-100 transition">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loadingBalances && (
        <div className="text-center py-4 text-xs text-gray-400">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
          Mise à jour des soldes...
        </div>
      )}

      {/* Users grid */}
      {users.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={faUserGroup} className="text-gray-300 text-xl" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Aucun utilisateur</p>
          <p className="text-xs text-gray-400 mt-1">Ajoute des utilisateurs pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {users.map((u, i) => (
            <div key={u.id || i} className={`rounded-2xl p-4 border transition ${
              u.address?.toLowerCase() === import.meta.env.VITE_CONTRACT_ADDRESS?.toLowerCase()
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {u.builtIn ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-medium">Démo</span>
                  ) : (
                    <button onClick={() => removeUser(u.id)}
                      className="text-gray-300 hover:text-red-500 transition p-1" title="Supprimer">
                      <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{u.role}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  parseFloat(u.balance) > 0 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                } font-medium`}>
                  {parseFloat(u.balance).toFixed(4)} ETH
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono text-gray-400 truncate max-w-[140px]">{short(u.address)}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => copyAddr(u.address)}
                    className="text-gray-300 hover:text-emerald-500 transition p-1" title="Copier l'adresse">
                    {copied === u.address
                      ? <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-xs" />
                      : <FontAwesomeIcon icon={faCopy} className="text-xs" />}
                  </button>
                  <a href={`https://sepolia.etherscan.io/address/${u.address}`} target="_blank" rel="noreferrer"
                    className="text-gray-300 hover:text-indigo-500 transition p-1" title="Voir sur Etherscan">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                  </a>
                </div>
              </div>

              <p className="text-[9px] text-gray-300 mt-1.5">
                ~{(parseFloat(u.balance) * 4000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-[10px] text-gray-300 mt-4">
        <FontAwesomeIcon icon={faShieldHalved} className="mr-1" />
        Les soldes sont lus en direct depuis la blockchain Sepolia
      </p>
    </div>
  );
}
