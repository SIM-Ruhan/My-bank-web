"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Footer from "@/components/Footer";
import {
  Landmark, Mail, Lock, Eye, EyeOff,
  ArrowRight, ShieldCheck, AlertCircle,
} from "lucide-react";

function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useSearchParams();

  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const justRegistered = params.get("registered") === "1";
  const redirectReason = params.get("reason");

  // If already logged in, bounce to home
  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(form);
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      showToast(`Welcome back, ${result.user.name.split(" ")[0]}!`, "success");
      router.push("/");
    }, 600);
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
              My<span className="text-indigo-500">Bank</span>
            </span>
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7 sm:p-8">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-400 mb-6">Log in to access your bank dashboard</p>

            {/* Just registered banner */}
            {justRegistered && (
              <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 mb-5">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Account created successfully! Please log in to continue.
                </p>
              </div>
            )}

            {/* Redirected due to protected route */}
            {redirectReason === "protected" && !justRegistered && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Please log in to continue.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Mail size={13} className="text-slate-400" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Lock size={13} className="text-slate-400" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                    Logging in…
                  </>
                ) : (
                  <>Log In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Register
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
