"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBanks } from "@/context/BankContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatCurrency, maskAccountNo } from "@/lib/utils";
import { ChevronLeft, User, Mail, Phone, Landmark, Shield, CreditCard, TrendingUp, TrendingDown } from "lucide-react";

export default function ProfilePage() {
  const { banks, totalBalance, transactions } = useBanks();
  const { currentUser, isAuthenticated, ready } = useAuth();
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

  const totalCredits = transactions.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0);
  const totalDebits  = transactions.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0);

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

  const user = currentUser;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto page-enter">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-semibold">
            <ChevronLeft size={16}/> Back to Dashboard
          </Link>

          {/* Profile header card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-5">
            <div className="h-24 grad-primary relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-2xl grad-primary border-4 border-white flex items-center justify-center shadow-xl">
                  <span className="text-white text-2xl font-extrabold">{user.initials}</span>
                </div>
              </div>
            </div>
            <div className="pt-14 px-6 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-800">{user.name}</h1>
                  <p className="text-sm text-slate-400 mt-0.5">Premium Member</p>
                </div>
                <span className="pill bg-emerald-100 text-emerald-600 flex items-center gap-1 mt-1">
                  <Shield size={9}/> Verified
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatBox label="Linked Banks"  value={banks.length}                icon={<Landmark size={15}/>} />
            <StatBox label="Net Worth"     value={formatCurrency(totalBalance)} icon={<TrendingUp size={15}/>} mono />
            <StatBox label="Transactions"  value={transactions.length}         icon={<CreditCard size={15}/>} />
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-4">
            <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
              <User size={14} className="text-indigo-500"/> Personal Information
            </h2>
            <div className="space-y-3">
              <InfoRow icon={<Mail size={14}/>}   label="Email"  value={user.email} />
              <InfoRow icon={<Phone size={14}/>}  label="Phone"  value={user.phone || "Not provided"} />
              <InfoRow icon={<Shield size={14}/>} label="Status" value="Active · Verified" green />
            </div>
          </div>

          {/* Linked banks */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-4">
            <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
              <Landmark size={14} className="text-indigo-500"/> Linked Banks
            </h2>
            {banks.length===0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No banks linked yet.</p>
            ) : (
              <div className="space-y-3">
                {banks.map((bank,i)=>(
                  <div key={bank.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg grad-primary flex items-center justify-center text-white text-xs font-extrabold">{i+1}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{bank.bankName}</p>
                        <p className="text-xs number-display text-slate-400">{maskAccountNo(bank.accountNo)}</p>
                      </div>
                    </div>
                    <p className="number-display text-sm font-extrabold text-slate-700">{formatCurrency(bank.balance)}</p>
                  </div>
                ))}
              </div>
            )}
            <Link href="/add-bank"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                border-2 border-dashed border-indigo-200 text-indigo-500 text-sm font-bold
                hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              + Add Another Bank
            </Link>
          </div>

          {/* Financial overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-500"/> Financial Overview
            </h2>
            <div className="space-y-3">
              <InfoRow icon={<TrendingUp  size={14} className="text-emerald-500"/>} label="Total Credited" value={formatCurrency(totalCredits)} green />
              <InfoRow icon={<TrendingDown size={14} className="text-rose-500"/>}   label="Total Debited"  value={formatCurrency(totalDebits)}  red   />
              <InfoRow icon={<CreditCard  size={14}/>}                              label="Net Balance"    value={formatCurrency(totalBalance)}        />
              <InfoRow icon={<Shield size={14} className="text-amber-500"/>}        label="Est. Tax (5%)"  value={formatCurrency(totalBalance*0.05)} amber />
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

function StatBox({ label, value, icon, mono }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center">
      <div className="flex justify-center mb-1.5 text-indigo-500">{icon}</div>
      <p className={`font-extrabold text-slate-800 ${mono?"number-display text-[11px]":"text-sm"}`}>{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value, green, red, amber }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
      <span className={`text-sm font-bold ${green?"text-emerald-600":red?"text-rose-500":amber?"text-amber-600":"text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}
