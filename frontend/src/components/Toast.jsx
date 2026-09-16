import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-up">
      <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
        toast.type === 'error'
          ? 'bg-rose-900 text-white border-rose-700'
          : 'bg-stone-900 text-white border-gold-500/40'
      }`}>
        {toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-gold-400" />
        )}
        <span>{toast.message}</span>
        <button onClick={onClose} className="text-stone-400 hover:text-white ml-2">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
