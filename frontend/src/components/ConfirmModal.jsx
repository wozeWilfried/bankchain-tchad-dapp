import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faClose, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{title || "Confirmer"}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message || "Êtes-vous sûr ?"}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-medium hover:bg-gray-100 transition">
            <FontAwesomeIcon icon={faClose} className="mr-1.5" />
            {cancelLabel || "Non"}
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition shadow-md">
            <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
            {confirmLabel || "Oui"}
          </button>
        </div>
      </div>
    </div>
  );
}
