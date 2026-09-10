export default function ConfirmationModal({ 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onClose, 
  isExecuting 
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 transition-opacity">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isExecuting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isExecuting ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
