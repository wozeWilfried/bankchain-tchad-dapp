import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faLock, faCircle, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../context/AppContext";

export default function PinModal() {
  const { pinModalOpen, submitPin, cancelPin } = useApp();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (pinModalOpen) {
      setPin(["", "", "", ""]);
      setError(false);
      setSuccess(false);
      setTimeout(() => inputs.current[0]?.focus(), 100);
    }
  }, [pinModalOpen]);

  if (!pinModalOpen) return null;

  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...pin];
    next[idx] = val.slice(-1);
    setPin(next);
    setError(false);
    if (val && idx < 3) {
      inputs.current[idx + 1]?.focus();
    }
    if (val && idx === 3) {
      const code = [...next.slice(0, 3), val.slice(-1)].join("");
      if (code.length === 4) {
        const ok = submitPin(code);
        if (ok) {
          setSuccess(true);
          setTimeout(() => cancelPin(), 400);
        } else {
          setError(true);
          setPin(["", "", "", ""]);
          setTimeout(() => inputs.current[0]?.focus(), 200);
        }
      }
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === "Escape") cancelPin();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 modal-overlay" onClick={cancelPin}>
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-2xl fade-in border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <button onClick={cancelPin} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition">
          <FontAwesomeIcon icon={faClose} className="text-sm" />
        </button>

        <div className="text-center mb-6">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border-2 ${
            success ? "bg-emerald-50 border-emerald-200" : error ? "bg-red-50 border-red-200" : "bg-indigo-50 border-indigo-200"
          }`}>
            {success ? (
              <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-xl" />
            ) : (
              <FontAwesomeIcon icon={faLock} className={`text-xl ${error ? "text-red-500" : "text-indigo-500"}`} />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800">Code de sécurité</h3>
          <p className="text-xs text-gray-400 mt-1">Saisis ton code à 4 chiffres</p>
        </div>

        <div className="flex justify-center gap-3 mb-4">
          {pin.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border-2 bg-white transition ${
                error ? "border-red-300 bg-red-50 text-red-500" : d ? "border-emerald-400 text-gray-800" : "border-gray-200 text-gray-800"
              } focus:outline-none focus:border-indigo-400`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs text-red-500 mb-2">
            <FontAwesomeIcon icon={faClose} className="mr-1" />
            Code incorrect. Réessaie.
          </p>
        )}

        <p className="text-center text-[10px] text-gray-300 mt-2">
          Code par défaut : 1234
        </p>
      </div>
    </div>
  );
}
