"use client";

import { useState } from "react";
import { useBanks } from "@/context/BankContext";
import { formatCurrency, maskAccountNo } from "@/lib/utils";
import { Wifi, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function BankCard({ bank, index }) {
  const { deleteBank } = useBanks();
  const [showModal,   setShowModal]   = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const colorClass = `bc-${bank.color ?? index % 6}`;

  function handleDelete() {
    setDeleting(true);
    setTimeout(() => {
      deleteBank(bank.id);
      setDeleting(false);
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  }

  return (
    <>
      {/* Bank Card */}
      <div
        className={`${colorClass} card-lift rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer group`}
        style={{ minHeight: 168 }}
        onClick={() => setShowModal(true)}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white opacity-[0.06]" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white opacity-[0.06]" />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
            <Trash2 size={13} className="text-white/80" />
          </div>
        </div>

        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-0.5">Bank</p>
            <p className="text-sm font-bold text-white leading-tight max-w-[160px]">{bank.bankName}</p>
          </div>
          <Wifi size={16} className="text-white/30 rotate-90 mt-1 shrink-0" />
        </div>

        {/* Account no */}
        <p className="number-display text-[11px] text-white/35 tracking-[0.22em] mb-2">
          {maskAccountNo(bank.accountNo)}
        </p>

        {/* Balance */}
        <p className="number-display text-[1.6rem] font-extrabold text-white leading-none mb-3">
          {formatCurrency(bank.balance)}
        </p>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/35">Account Holder</p>
            <p className="text-xs font-semibold text-white/80 mt-0.5">{bank.accountHolder}</p>
          </div>
          <div className="text-[10px] text-white/25 font-medium bg-white/10 px-2.5 py-1 rounded-full">
            Savings
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box bg-white rounded-3xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            {/* Card preview inside modal */}
            <div className={`${colorClass} rounded-t-3xl p-5 relative overflow-hidden`}>
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white opacity-[0.07]" />
              <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Bank</p>
              <p className="text-base font-bold text-white">{bank.bankName}</p>
              <p className="number-display text-2xl font-extrabold text-white mt-1">{formatCurrency(bank.balance)}</p>
              <p className="number-display text-[11px] text-white/35 tracking-widest mt-1">{maskAccountNo(bank.accountNo)}</p>
            </div>

            <div className="p-5">
              {/* Warning */}
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-3.5 mb-5">
                <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-700">Remove this account?</p>
                  <p className="text-xs text-rose-500 mt-0.5 leading-relaxed">
                    This will unlink <strong>{bank.bankName}</strong> from your dashboard. Your actual bank account is unaffected.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm
                    hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold text-sm
                    hover:from-rose-600 hover:to-red-600 active:scale-95 transition-all shadow-md
                    disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"/>
                        <path fill="white" className="opacity-75" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"/>
                      </svg>
                      Removing…
                    </>
                  ) : (
                    <><Trash2 size={15} /> Delete Account</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showSuccess && (
        <div className="toast-enter fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <p className="text-sm font-semibold">Account removed successfully</p>
        </div>
      )}
    </>
  );
}
