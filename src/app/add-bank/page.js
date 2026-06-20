"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBanks } from "@/context/BankContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BANK_LIST } from "@/lib/utils";
import { ChevronLeft, Landmark, ChevronDown, User, CreditCard, Lock, Wallet, CheckCircle2, AlertCircle, Shield } from "lucide-react";

export default function AddBankPage() {
  const { addBank } = useBanks();
  const { isAuthenticated, ready } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Guard: bounce unauthenticated visitors (e.g. direct URL access) straight to login
  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      showToast("Login required!", "warning");
      router.replace("/login?reason=protected");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isAuthenticated]);

  const [form, setForm] = useState({ bankName:"", accountHolder:"", accountNo:"", password:"", balance:"" });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  function validate() {
    const e = {};
    if (!form.bankName)      e.bankName      = "Please select a bank.";
    if (!form.accountHolder) e.accountHolder = "Account holder name is required.";
    if (!form.accountNo || form.accountNo.length < 10) e.accountNo = "Enter a valid account number (min 10 digits).";
    if (!form.password || form.password.length < 6)    e.password  = "Password must be at least 6 characters.";
    if (!form.balance || isNaN(form.balance) || Number(form.balance) <= 0) e.balance = "Enter a valid balance amount.";
    return e;
  }

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Login required!", "warning");
      router.push("/login?reason=protected");
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      addBank({ bankName:form.bankName, accountHolder:form.accountHolder, accountNo:form.accountNo, balance:Number(form.balance) });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => router.push("/"), 1800);
    }, 1000);
  }

  // Avoid flashing the form before the redirect effect kicks in
  if (!ready || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-lg mx-auto page-enter">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-semibold">
            <ChevronLeft size={16}/> Back to Dashboard
          </Link>

          {submitted ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle2 size={40} className="text-emerald-500"/>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Bank Linked!</h2>
              <p className="text-slate-500 max-w-xs text-sm">
                <strong>{form.bankName}</strong> has been added to your dashboard. Redirecting to home…
              </p>
              <div className="mt-5 flex gap-1.5">
                {[0,1,2].map(i=>(
                  <div key={i} className="w-2 h-2 rounded-full bg-indigo-400"
                    style={{animation:`pulse 1s ease-in-out ${i*0.2}s infinite`}} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl grad-primary flex items-center justify-center shadow-lg">
                  <Landmark size={22} className="text-white"/>
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800">Add New Bank</h1>
                  <p className="text-sm text-slate-400">Link an account to your dashboard</p>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 mb-5">
                <Shield size={15} className="text-indigo-500 shrink-0"/>
                <p className="text-xs text-indigo-600">This is a demo — your data stays in your browser session only.</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">

                <Field label="Select Bank" icon={<Landmark size={15}/>} error={errors.bankName}>
                  <div className="relative">
                    <select name="bankName" value={form.bankName} onChange={handleChange}
                      className={`w-full appearance-none bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 pr-10 transition-all
                        ${errors.bankName?"border-rose-400 bg-rose-50":"border-slate-200 focus:border-indigo-400"}`}>
                      <option value="">-- Choose your bank --</option>
                      {BANK_LIST.map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  </div>
                </Field>

                <Field label="Account Holder Name" icon={<User size={15}/>} error={errors.accountHolder}>
                  <input type="text" name="accountHolder" value={form.accountHolder} onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 transition-all
                      ${errors.accountHolder?"border-rose-400 bg-rose-50":"border-slate-200 focus:border-indigo-400"}`}/>
                </Field>

                <Field label="Account Number" icon={<CreditCard size={15}/>} error={errors.accountNo}>
                  <input type="text" name="accountNo" value={form.accountNo} onChange={handleChange}
                    placeholder="e.g. 2054100012345" maxLength={20}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 transition-all
                      ${errors.accountNo?"border-rose-400 bg-rose-50":"border-slate-200 focus:border-indigo-400"}`}/>
                </Field>

                <Field label="Banking Password" icon={<Lock size={15}/>} error={errors.password}>
                  <input type="password" name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your bank password"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 transition-all
                      ${errors.password?"border-rose-400 bg-rose-50":"border-slate-200 focus:border-indigo-400"}`}/>
                </Field>

                <Field label="Current Balance (৳)" icon={<Wallet size={15}/>} error={errors.balance}>
                  <input type="number" name="balance" value={form.balance} onChange={handleChange}
                    placeholder="e.g. 50000" min="0"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 transition-all
                      ${errors.balance?"border-rose-400 bg-rose-50":"border-slate-200 focus:border-indigo-400"}`}/>
                </Field>

                <button type="submit" disabled={loading}
                  className="w-full grad-primary text-white font-bold py-3.5 rounded-xl
                    hover:opacity-90 active:scale-[0.98] transition-all shadow-lg
                    disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"/>
                      <path fill="white" className="opacity-75" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"/>
                    </svg>Linking Account…</>
                  ) : "Link Bank Account"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        <span className="text-slate-400">{icon}</span>{label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle size={11}/>{error}
        </p>
      )}
    </div>
  );
}
