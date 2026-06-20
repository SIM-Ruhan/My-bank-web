"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBanks } from "@/context/BankContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Search, Filter, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, banks } = useBanks();
  const { isAuthenticated, ready } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      showToast("Login required!", "warning");
      router.replace("/login?reason=protected");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isAuthenticated]);

  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterBank, setFilterBank] = useState("all");

  const bankNames = [...new Set(banks.map(b=>b.bankName))];
  const filtered  = transactions.filter(tx => {
    const m = tx.desc.toLowerCase().includes(search.toLowerCase()) || tx.bank.toLowerCase().includes(search.toLowerCase());
    const t = filterType==="all" || tx.type===filterType;
    const b = filterBank==="all" || tx.bank===filterBank;
    return m && t && b;
  });

  const totalIn  = filtered.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0);
  const totalOut = filtered.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0);

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
      <Navbar/>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto page-enter">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-semibold">
            <ChevronLeft size={16}/> Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-slate-800">Transactions</h1>
            <span className="pill bg-indigo-100 text-indigo-600">{filtered.length} records</span>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-600"/>
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-semibold">Total In</p>
                <p className="number-display text-base font-extrabold text-emerald-700">৳{totalIn.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
                <TrendingDown size={16} className="text-rose-600"/>
              </div>
              <div>
                <p className="text-xs text-rose-600 font-semibold">Total Out</p>
                <p className="number-display text-base font-extrabold text-rose-700">৳{totalOut.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Search transactions…" value={search}
                onChange={e=>setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400"/>
            </div>
            <div className="flex gap-2">
              {["all","credit","debit"].map(t=>(
                <button key={t} onClick={()=>setFilterType(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all
                    ${filterType===t ? "grad-primary text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <select value={filterBank} onChange={e=>setFilterBank(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-8 pr-6 py-2.5 text-xs text-slate-700 focus:border-indigo-400 appearance-none">
                <option value="all">All Banks</option>
                {bankNames.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {filtered.length===0 ? (
              <div className="py-16 text-center">
                <Search size={32} className="text-slate-200 mx-auto mb-3"/>
                <p className="text-slate-500 text-sm font-semibold">No transactions found</p>
                <p className="text-slate-400 text-xs mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map(tx=>{
                  const isCredit = tx.type==="credit";
                  return (
                    <div key={tx.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCredit?"bg-emerald-100 text-emerald-600":"bg-rose-100 text-rose-500"}`}>
                          {isCredit ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{tx.desc}</p>
                          <p className="text-xs text-slate-400">{tx.bank} · {formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <p className={`number-display text-sm font-extrabold ${isCredit?"text-emerald-600":"text-rose-500"}`}>
                        {isCredit?"+":"-"}৳{tx.amount.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
