"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickActions from "@/components/QuickActions";
import BankCard from "@/components/BankCard";
import AddBankSection from "@/components/AddBankSection";
import { useBanks } from "@/context/BankContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft,
  Landmark, ShieldCheck, LogIn, UserPlus, Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { banks, totalBalance, transactions, TAX_RATE } = useBanks();
  const { currentUser, isAuthenticated } = useAuth();

  const totalTax     = totalBalance * TAX_RATE;
  const recentTxs    = transactions.slice(0, 5);
  const totalCredits = transactions.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0);
  const totalDebits  = transactions.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 page-enter">

        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-3xl grad-primary p-6 sm:p-8 mb-8 shadow-xl">
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white opacity-[0.06]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white opacity-[0.06]" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-sm font-semibold mb-1">
                {isAuthenticated ? `Good day, ${currentUser.name.split(" ")[0]} 👋` : "Welcome 👋"}
              </p>
              <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-1">Your Financial Hub</h1>
              <p className="text-indigo-200 text-sm">
                {isAuthenticated
                  ? `${banks.length} bank${banks.length!==1?"s":""} linked · All balances in one place`
                  : "Sign in to link your banks and see everything in one place"}
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center shrink-0">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Net Worth</p>
              <p className="number-display text-white text-2xl font-extrabold">{formatCurrency(totalBalance)}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ShieldCheck size={11} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-300 font-medium">Bank-grade security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logged-out CTA */}
        {!isAuthenticated && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 sm:p-7 mb-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl grad-primary flex items-center justify-center shadow-md shrink-0">
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Get started with BankFlow</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Create a free account to link your banks, track transactions, and more.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 transition-colors">
                <LogIn size={14} /> Login
              </Link>
              <Link href="/register"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white grad-primary shadow-md hover:opacity-90 active:scale-95 transition-all">
                <UserPlus size={14} /> Register
              </Link>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard icon={<Wallet size={18}/>}          label="Total Balance" value={formatCurrency(totalBalance)} sub={`${banks.length} accounts`}          color="indigo" />
          <StatCard icon={<ArrowDownLeft size={18}/>}   label="Total Income"  value={formatCurrency(totalCredits)} sub="All time"                               color="emerald"/>
          <StatCard icon={<ArrowUpRight size={18}/>}    label="Total Spent"   value={formatCurrency(totalDebits)}  sub="All time"                               color="rose"   />
          <StatCard icon={<TrendingUp size={18}/>}      label="Est. Tax (5%)" value={formatCurrency(totalTax)}     sub="Tap Tax Calculation"                    color="amber"  />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* My Banks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Landmark size={18} className="text-indigo-500" />
              <h2 className="text-lg font-extrabold text-slate-800">My Bank Accounts</h2>
            </div>
            <span className="pill bg-slate-100 text-slate-500">{banks.length} linked</span>
          </div>

          {banks.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center mb-4">
              <Landmark size={36} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold">
                {isAuthenticated ? "No banks linked yet" : "Log in to see your linked banks"}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {isAuthenticated ? "Add your first bank account below" : "Your bank accounts will appear here once you're signed in"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {banks.map((bank, i) => (
                <BankCard key={bank.id} bank={bank} index={i} />
              ))}
            </div>
          )}

          <AddBankSection />
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-800">Recent Transactions</h2>
            <a href="/transactions" className="text-sm text-indigo-500 font-bold hover:text-indigo-700 transition-colors">
              View all →
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {recentTxs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                {isAuthenticated ? "No transactions yet." : "Log in to view your transactions."}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentTxs.map(tx => <TxRow key={tx.id} tx={tx} />)}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  const colors = {
    indigo:  "from-indigo-50 to-indigo-100/60  border-indigo-100  text-indigo-600",
    emerald: "from-emerald-50 to-emerald-100/60 border-emerald-100 text-emerald-600",
    rose:    "from-rose-50 to-rose-100/60       border-rose-100    text-rose-600",
    amber:   "from-amber-50 to-amber-100/60     border-amber-100   text-amber-600",
  };
  return (
    <div className={`card-lift bg-gradient-to-br ${colors[color]} border rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2 opacity-80">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="number-display text-base sm:text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
      <p className="text-[11px] text-slate-400 mt-1 font-medium">{sub}</p>
    </div>
  );
}

function TxRow({ tx }) {
  const isCredit = tx.type === "credit";
  return (
    <div className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCredit?"bg-emerald-100 text-emerald-600":"bg-rose-100 text-rose-500"}`}>
          {isCredit ? <ArrowDownLeft size={15}/> : <ArrowUpRight size={15}/>}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{tx.desc}</p>
          <p className="text-xs text-slate-400">{tx.bank} · {tx.date}</p>
        </div>
      </div>
      <p className={`number-display text-sm font-extrabold ${isCredit?"text-emerald-600":"text-rose-500"}`}>
        {isCredit?"+":"-"}৳{tx.amount.toLocaleString()}
      </p>
    </div>
  );
}
