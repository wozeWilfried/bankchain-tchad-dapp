import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup, faCopy, faCheck, faTrashCan, faUserPlus,
  faUsers, faEnvelope, faAddressCard, faDownload, faUpload,
  faSpinner, faClose, faArrowUpRightFromSquare,
  faShieldHalved, faRefresh, faCircleCheck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { DEMO_USERS } from "../config/demoUsers";
import ConfirmModal from "./ConfirmModal";

const STORAGE_KEY = "bankchain_custom_users";

function loadAllUsers() {
  const builtIn = DEMO_USERS.map((u) => ({ ...u, builtIn: true }));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    return [...builtIn, ...custom.filter((u) => !u.builtIn)];
  } catch {
    return builtIn;
  }
}

function saveCustomUsers(users) {
  const custom = users.filter((u) => !u.builtIn);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

function validateAddress(addr) {
  return addr.startsWith("0x") && addr.length === 42;
}

export default function UserManagement({ provider }) {
  const [users, setUsers] = useState(() => loadAllUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(null);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [importMsg, setImportMsg] = useState(null);

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
          let b = "0";
          try {
            if (validateAddress(u.address)) {
              const bal = await contract.getBalance(u.address);
              b = window.ethers.formatEther(bal);
            }
          } catch {}
          return { ...u, balance: b };
        })
      );
      setUsers(updated);
      saveCustomUsers(updated);
    } catch {}
    setLoadingBalances(false);
  }, [provider, users.length]);

  useEffect(() => { refreshBalances(); }, []);

  const copyAddr = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.email.trim()) e.email = "L'email est requis";
    else if (!form.email.includes("@")) e.email = "Email invalide";
    if (!form.address.trim()) e.address = "L'adresse est requise";
    else if (!validateAddress(form.address)) e.address = "Adresse ETH invalide (0x + 42 caractères)";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const addUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
    saveCustomUsers(updated);
    setForm({ name: "", email: "", address: "" });
    setFormErrors({});
    setShowAddModal(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const updated = users.filter((u) => u.id !== deleteTarget.id);
    setUsers(updated);
    saveCustomUsers(updated);
    setDeleteTarget(null);
  };

  const exportJSON = () => {
    const data = JSON.stringify(users, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bankchain-users-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (!Array.isArray(imported)) throw new Error("Format invalide");
          const valid = imported.filter((u) => u.name && u.email && u.address);
          if (valid.length === 0) throw new Error("Aucun utilisateur valide");
          const existing = users.filter((u) => u.builtIn);
          const merged = [...existing, ...valid.map((u) => ({ ...u, id: Date.now() + Math.random(), builtIn: false, balance: "0" }))];
          setUsers(merged);
          saveCustomUsers(merged);
          setImportMsg({ type: "success", text: `${valid.length} utilisateur(s) importé(s)` });
          setTimeout(() => setImportMsg(null), 3000);
        } catch (err) {
          setImportMsg({ type: "error", text: "Fichier JSON invalide" });
          setTimeout(() => setImportMsg(null), 3000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const short = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
              <FontAwesomeIcon icon={faUsers} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Utilisateurs</h2>
              <p className="text-xs text-gray-400">
                <span className="font-medium text-indigo-600">{users.length}</span> membre(s) sur le réseau
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={refreshBalances} disabled={loadingBalances}
              className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 text-xs font-medium transition bg-white/80" title="Actualiser les soldes">
              <FontAwesomeIcon icon={loadingBalances ? faSpinner : faRefresh} spin={loadingBalances} className="mr-1" />
              Soldes
            </button>
            <button onClick={exportJSON}
              className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 text-xs font-medium transition bg-white/80">
              <FontAwesomeIcon icon={faDownload} className="mr-1" />
              Exporter
            </button>
            <button onClick={importJSON}
              className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 text-xs font-medium transition bg-white/80">
              <FontAwesomeIcon icon={faUpload} className="mr-1" />
              Importer
            </button>
            <button onClick={() => { setShowAddModal(true); setFormErrors({}); }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium hover:from-indigo-600 hover:to-purple-600 transition shadow-md shadow-indigo-200">
              <FontAwesomeIcon icon={faUserPlus} className="mr-1.5" />
              Nouveau client
            </button>
          </div>
        </div>
      </div>

      {/* Import message */}
      {importMsg && (
        <div className={`px-4 py-3 rounded-2xl border text-sm fade-in ${
          importMsg.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <FontAwesomeIcon icon={importMsg.type === "success" ? faCircleCheck : faClose} className="mr-2" />
          {importMsg.text}
        </div>
      )}

      {/* Loading */}
      {loadingBalances && users.length > 0 && (
        <div className="text-center py-2 text-xs text-gray-400">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
          Lecture des soldes sur la blockchain...
        </div>
      )}

      {/* Grid */}
      {users.length === 0 ? (
        <div className="bg-white/90 rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUserGroup} className="text-gray-300 text-2xl" />
          </div>
          <p className="text-gray-500 font-medium">Aucun utilisateur</p>
          <p className="text-xs text-gray-400 mt-1">Ajoute des clients pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {users.map((u, i) => {
            const initial = u.name.charAt(0).toUpperCase();
            const colors = [
              "from-indigo-400 to-purple-400",
              "from-emerald-400 to-teal-400",
              "from-amber-400 to-orange-400",
              "from-rose-400 to-pink-400",
              "from-sky-400 to-blue-400",
              "from-violet-400 to-fuchsia-400",
            ];
            const grad = colors[i % colors.length];
            return (
              <div key={u.id || i}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                {/* Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-[130px] sm:max-w-[160px]">{u.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition">
                    {u.builtIn ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-medium border border-indigo-100">Démo</span>
                    ) : (
                      <button onClick={() => setDeleteTarget(u)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center">
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                      </button>
                    )}
                  </div>
                  {u.builtIn && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-medium border border-indigo-100 shrink-0">Démo</span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50/80 text-indigo-600 font-medium border border-indigo-100/50">{u.role}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium border ${
                    parseFloat(u.balance) > 0
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                  }`}>
                    {parseFloat(u.balance).toFixed(4)} ETH
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <p className="text-[10px] font-mono text-gray-500 truncate max-w-[120px] sm:max-w-[160px]">{u.address}</p>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => copyAddr(u.address)}
                      className="w-6 h-6 rounded-md text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 transition flex items-center justify-center" title="Copier">
                      {copied === u.address
                        ? <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-[10px]" />
                        : <FontAwesomeIcon icon={faCopy} className="text-[10px]" />}
                    </button>
                    <a href={`https://sepolia.etherscan.io/address/${u.address}`} target="_blank" rel="noreferrer"
                      className="w-6 h-6 rounded-md text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition flex items-center justify-center" title="Etherscan">
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                    </a>
                  </div>
                </div>

                {/* FCFA */}
                <p className="text-[9px] text-gray-300 mt-2">
                  ≈ {(parseFloat(u.balance) * 4000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-300">
        <FontAwesomeIcon icon={faShieldHalved} className="mr-1" />
        Données stockées en localStorage &middot; Export JSON disponible
      </p>

      {/* ===== MODAL AJOUT CLIENT ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl fade-in border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
              <FontAwesomeIcon icon={faClose} className="text-sm" />
            </button>

            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <FontAwesomeIcon icon={faUserPlus} className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-1">Nouveau client</h3>
            <p className="text-xs text-gray-400 text-center mb-6">Ajoute un membre au réseau BankChain</p>

            <form onSubmit={addUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  Nom complet
                </label>
                <input type="text" placeholder="Jean Dupont" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`input-field text-sm ${formErrors.name ? "border-red-300 ring-1 ring-red-300" : ""}`} autoFocus />
                {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                  Email
                </label>
                <input type="email" placeholder="jean@bankchain.td" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`input-field text-sm ${formErrors.email ? "border-red-300 ring-1 ring-red-300" : ""}`} />
                {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  <FontAwesomeIcon icon={faAddressCard} className="mr-1" />
                  Adresse Ethereum
                </label>
                <input type="text" placeholder="0x..." value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`input-field text-sm font-mono ${formErrors.address ? "border-red-300 ring-1 ring-red-300" : ""}`} />
                {formErrors.address && <p className="text-red-500 text-[10px] mt-1">{formErrors.address}</p>}
              </div>

              <div className="pt-2">
                <button type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm hover:from-indigo-600 hover:to-purple-600 transition shadow-md shadow-indigo-200">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1.5" />
                  Ajouter au réseau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL CONFIRMATION SUPPRESSION ===== */}
      <ConfirmModal
        open={!!deleteTarget}
        variant="danger"
        title="Supprimer cet utilisateur ?"
        message={
          deleteTarget
            ? `L'utilisateur "${deleteTarget.name}" (${deleteTarget.email}) sera définitivement supprimé du réseau.`
            : ""
        }
        confirmLabel="Oui, supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
