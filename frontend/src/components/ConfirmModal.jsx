import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation, faClose, faCheck, faTrashCan,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

export default function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant }) {
  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 modal-overlay" onClick={onCancel}>
      <div className="relative bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl fade-in border border-gray-100 mx-auto" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border ${
          isDanger ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
        }`}>
          <FontAwesomeIcon icon={isDanger ? faTrashCan : faCircleQuestion}
            className={isDanger ? "text-red-500 text-xl" : "text-amber-500 text-xl"} />
        </div>

        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{title || "Confirmer"}</h3>
        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">{message || "Êtes-vous sûr ?"}</p>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-medium hover:bg-gray-100 transition text-sm">
            <FontAwesomeIcon icon={faClose} className="mr-1.5" />
            {cancelLabel || "Annuler"}
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-medium transition shadow-md text-sm ${
              isDanger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}>
            <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
            {confirmLabel || "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
