"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import {
  Landmark, User, Mail, Phone, Lock, Eye, EyeOff,
  ArrowRight, AlertCircle, CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register({
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      });
      setLoading(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=1");
      }, 1400);
    }, 700);
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center page-enter">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5 mx-auto shadow-lg">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Account Created!</h2>
            <p className="text-slate-500 text-sm">
              Welcome, <strong>{form.name.split(" ")[0]}</strong>. Redirecting you to login…
            </p>
            <div className="mt-6 flex gap-1.5 justify-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-indigo-400"
                  style={{ animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center px-4 py-12 page-enter">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 group">
            <div className="w-11 h-11 rounded-2xl grad-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Landmark size={22} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-800">
              My<span className="text-indigo-600">Bank</span>
            </span>
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7 sm:p-8">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Create your account</h1>
            <p className="text-sm text-slate-400 mb-6">Start managing all your banks in one place</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <User size={13} className="text-slate-400" /> Full Name
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" autoComplete="name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Mail size={13} className="text-slate-400" /> Email
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Phone size={13} className="text-slate-400" /> Phone <span className="normal-case font-medium text-slate-300">(optional)</span>
                </label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+880 1XXX-XXXXXX" autoComplete="tel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Lock size={13} className="text-slate-400" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="At least 6 characters" autoComplete="new-password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Lock size={13} className="text-slate-400" /> Confirm Password
                </label>
                <input
                  type={showPwd ? "text" : "password"} name="confirm" value={form.confirm} onChange={handleChange}
                  placeholder="Re-enter your password" autoComplete="new-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 px-3.5 py-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full grad-primary text-white font-bold py-3.5 rounded-xl
                  hover:opacity-90 active:scale-[0.98] transition-all shadow-lg
                  disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25" />
                      <path fill="white" className="opacity-75" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Log In
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo only — accounts and balances are stored locally in your browser.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
