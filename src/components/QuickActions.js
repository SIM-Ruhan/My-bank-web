"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBanks } from "@/context/BankContext";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeftRight, Smartphone, QrCode, FileText,
  PiggyBank, Building2, ShieldCheck, Car,
  Heart, Calculator, X, CheckCircle2, ChevronDown,
} from "lucide-react";

/* ─── action config ────────────────────────────────────────── */
const ACTIONS = [
  { id:"transfer",  label:"Balance Transfer", icon:ArrowLeftRight, color:"indigo"  },
  { id:"recharge",  label:"Mobile Recharge",  icon:Smartphone,     color:"sky"     },
  { id:"payment",   label:"Payment",          icon:QrCode,         color:"violet"  },
  { id:"bill",      label:"Pay Bill",         icon:FileText,       color:"amber"   },
  { id:"savings",   label:"Savings",          icon:PiggyBank,      color:"emerald" },
  { id:"loan",      label:"Loan",             icon:Building2,      color:"rose"    },
  { id:"insurance", label:"Insurance",        icon:ShieldCheck,    color:"teal"    },
  { id:"toll",      label:"Toll",             icon:Car,            color:"orange"  },
  { id:"donation",  label:"Donation",         icon:Heart,          color:"pink"    },
  { id:"tax",       label:"Tax Calculation",  icon:Calculator,     color:"indigo", route:"/tax-calculation" },
];

const C = {
  indigo:  { wrap:"bg-indigo-50 hover:bg-indigo-100 border-indigo-200",  icon:"bg-indigo-100 text-indigo-600",  ring:"ring-indigo-200",  txt:"text-indigo-700"  },
  sky:     { wrap:"bg-sky-50 hover:bg-sky-100 border-sky-200",           icon:"bg-sky-100 text-sky-600",        ring:"ring-sky-200",     txt:"text-sky-700"     },
  violet:  { wrap:"bg-violet-50 hover:bg-violet-100 border-violet-200",  icon:"bg-violet-100 text-violet-600",  ring:"ring-violet-200",  txt:"text-violet-700"  },
  amber:   { wrap:"bg-amber-50 hover:bg-amber-100 border-amber-200",     icon:"bg-amber-100 text-amber-600",    ring:"ring-amber-200",   txt:"text-amber-700"   },
  emerald: { wrap:"bg-emerald-50 hover:bg-emerald-100 border-emerald-200",icon:"bg-emerald-100 text-emerald-600",ring:"ring-emerald-200",txt:"text-emerald-700" },
  rose:    { wrap:"bg-rose-50 hover:bg-rose-100 border-rose-200",        icon:"bg-rose-100 text-rose-600",      ring:"ring-rose-200",    txt:"text-rose-700"    },
  teal:    { wrap:"bg-teal-50 hover:bg-teal-100 border-teal-200",        icon:"bg-teal-100 text-teal-600",      ring:"ring-teal-200",    txt:"text-teal-700"    },
  orange:  { wrap:"bg-orange-50 hover:bg-orange-100 border-orange-200",  icon:"bg-orange-100 text-orange-600",  ring:"ring-orange-200",  txt:"text-orange-700"  },
  pink:    { wrap:"bg-pink-50 hover:bg-pink-100 border-pink-200",        icon:"bg-pink-100 text-pink-600",      ring:"ring-pink-200",    txt:"text-pink-700"    },
};

/* ─── main component ────────────────────────────────────────── */
export default function QuickActions() {
  const router = useRouter();
  const guard = useAuthGuard();
  const [active, setActive] = useState(null);

  function handleActionClick(a) {
    if (!guard()) return;
    if (a.route) router.push(a.route);
    else setActive(a.id);
  }

  return (
    <>
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-800">Quick Actions</h2>
          <span className="pill bg-indigo-100 text-indigo-600">10 services</span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3">
          {ACTIONS.map((a) => {
            const theme = C[a.color] || C.indigo;
            const Icon  = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => handleActionClick(a)}
                className={`qa-btn flex flex-col items-center gap-2 p-2.5 sm:p-3.5 rounded-2xl border
                  ${theme.wrap} transition-all duration-200 shadow-sm`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${theme.icon} shadow-sm`}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold text-center leading-tight ${theme.txt}`}>
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Render the right modal */}
      {active === "transfer"  && <TransferModal  onClose={() => setActive(null)} />}
      {active === "recharge"  && <RechargeModal  onClose={() => setActive(null)} />}
      {active === "payment"   && <PaymentModal   onClose={() => setActive(null)} />}
      {active === "bill"      && <BillModal      onClose={() => setActive(null)} />}
      {active === "savings"   && <SavingsModal   onClose={() => setActive(null)} />}
      {active === "loan"      && <LoanModal      onClose={() => setActive(null)} />}
      {active === "insurance" && <InsuranceModal onClose={() => setActive(null)} />}
      {active === "toll"      && <TollModal      onClose={() => setActive(null)} />}
      {active === "donation"  && <DonationModal  onClose={() => setActive(null)} />}
    </>
  );
}

/* ─── shared modal shell ────────────────────────────────────── */
function Modal({ title, icon, color = "indigo", onClose, children }) {
  const theme = C[color] || C.indigo;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-100`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${theme.icon} flex items-center justify-center`}>
              {icon}
            </div>
            <h3 className="text-base font-extrabold text-slate-800">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>
        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── shared field ──────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-400 transition-all";
const selectCls = inputCls + " appearance-none";

function BankSelect({ value, onChange, banks }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={selectCls}>
        <option value="">-- Select bank --</option>
        {banks.map((b) => (
          <option key={b.id} value={b.id}>{b.bankName} ({formatCurrency(b.balance)})</option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function SuccessView({ message, onClose }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
        <CheckCircle2 size={36} className="text-emerald-500" />
      </div>
      <p className="text-base font-bold text-slate-800 mb-1">Success!</p>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <button onClick={onClose} className="px-6 py-2.5 grad-primary text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-md">
        Done
      </button>
    </div>
  );
}

function SubmitBtn({ loading, label = "Confirm", color = "grad-primary" }) {
  return (
    <button type="submit" disabled={loading}
      className={`w-full py-3 ${color} text-white font-bold rounded-xl text-sm
        hover:opacity-90 active:scale-[0.98] transition-all shadow-md
        disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
    >
      {loading ? (
        <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"/>
          <path fill="white" className="opacity-75" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"/>
        </svg>Processing…</>
      ) : label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. BALANCE TRANSFER
════════════════════════════════════════════════════════════ */
function TransferModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [from,    setFrom]    = useState("");
  const [to,      setTo]      = useState("");
  const [amount,  setAmount]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const fromBank  = banks.find((b) => b.id === from);
    const toBank    = banks.find((b) => b.id === to);
    const amt       = Number(amount);
    if (!from || !to)        return setErr("Please select both banks.");
    if (from === to)         return setErr("Source and destination must be different.");
    if (!amt || amt <= 0)    return setErr("Enter a valid amount.");
    if (amt > fromBank.balance) return setErr(`Insufficient balance in ${fromBank.bankName}.`);

    setLoading(true);
    setTimeout(() => {
      updateBankBalance(from, fromBank.balance - amt);
      updateBankBalance(to,   toBank.balance   + amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit",  bank:fromBank.bankName, desc:`Transfer to ${toBank.bankName}`,   amount:amt, date:new Date().toISOString().split("T")[0] });
      addTransaction({ id:"tx"+Date.now()+1, type:"credit", bank:toBank.bankName, desc:`Transfer from ${fromBank.bankName}`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false);
      setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Balance Transfer" icon={<ArrowLeftRight size={17} />} color="indigo" onClose={onClose}>
      {done ? <SuccessView message={`৳${Number(amount).toLocaleString()} transferred successfully.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="From Bank"><BankSelect value={from} onChange={(e) => setFrom(e.target.value)} banks={banks} /></Field>
          <Field label="To Bank"><BankSelect value={to}   onChange={(e) => setTo(e.target.value)}   banks={banks} /></Field>
          <Field label="Amount (৳)">
            <input type="number" min="1" placeholder="Enter amount" value={amount}
              onChange={(e) => setAmount(e.target.value)} className={inputCls} />
          </Field>
          {from && banks.find(b=>b.id===from) && (
            <p className="text-xs text-slate-400 mb-4 -mt-2">
              Available: <span className="font-bold text-slate-600">{formatCurrency(banks.find(b=>b.id===from).balance)}</span>
            </p>
          )}
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Transfer Now" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. MOBILE RECHARGE
════════════════════════════════════════════════════════════ */
function RechargeModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,  setBankId]  = useState("");
  const [phone,   setPhone]   = useState("");
  const [op,      setOp]      = useState("Grameenphone");
  const [amount,  setAmount]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  const ops = ["Grameenphone","Robi","Banglalink","Airtel","Teletalk"];
  const presets = [19,29,49,99,149,199,299,499];

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId)           return setErr("Select a bank.");
    if (!/^01[3-9]\d{8}$/.test(phone)) return setErr("Enter a valid 11-digit BD number.");
    if (!amt || amt<=0)    return setErr("Select or enter an amount.");
    if (amt > bank.balance) return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`${op} Recharge ${phone}`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Mobile Recharge" icon={<Smartphone size={17} />} color="sky" onClose={onClose}>
      {done ? <SuccessView message={`${op} ${phone} recharged with ৳${amount}.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Operator">
            <div className="flex gap-2 flex-wrap">
              {ops.map(o => (
                <button type="button" key={o} onClick={() => setOp(o)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${op===o ? "bg-sky-500 text-white border-sky-500" : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"}`}>
                  {o}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Phone Number">
            <input type="tel" placeholder="01XXXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)} className={inputCls} maxLength={11} />
          </Field>
          <Field label="Amount (৳)">
            <div className="flex flex-wrap gap-2 mb-2">
              {presets.map(p => (
                <button type="button" key={p} onClick={() => setAmount(String(p))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${amount===String(p) ? "bg-sky-500 text-white border-sky-500" : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"}`}>
                  ৳{p}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Or type amount" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pay From"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Recharge Now" color="bg-sky-500 hover:bg-sky-600" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. PAYMENT (QR/Merchant)
════════════════════════════════════════════════════════════ */
function PaymentModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,   setBankId]   = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount,   setAmount]   = useState("");
  const [note,     setNote]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [err,      setErr]      = useState("");

  const merchants = ["ShopUp","Shajgoj","Chaldal","Pathao","Shohoz","Daraz","Khaas Food","Foodpanda"];

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId || !merchant) return setErr("Select bank and merchant.");
    if (!amt || amt<=0)       return setErr("Enter a valid amount.");
    if (amt > bank.balance)   return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`Payment to ${merchant}${note?" — "+note:""}`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Payment" icon={<QrCode size={17} />} color="violet" onClose={onClose}>
      {done ? <SuccessView message={`Payment of ৳${Number(amount).toLocaleString()} to ${merchant} successful.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Merchant">
            <div className="relative">
              <select value={merchant} onChange={e=>setMerchant(e.target.value)} className={selectCls}>
                <option value="">-- Select merchant --</option>
                {merchants.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Amount (৳)">
            <input type="number" placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Note (optional)">
            <input type="text" placeholder="e.g. Order #1234" value={note} onChange={e=>setNote(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pay From"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Pay Now" color="bg-violet-600 hover:bg-violet-700" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. PAY BILL
════════════════════════════════════════════════════════════ */
function BillModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,    setBankId]    = useState("");
  const [billType,  setBillType]  = useState("");
  const [accNo,     setAccNo]     = useState("");
  const [amount,    setAmount]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [err,       setErr]       = useState("");

  const bills = ["DESCO Electricity","DPDC Electricity","WASA Water","Titas Gas","BTCL Phone","Internet Bill","BREB Electricity","City Corporation"];

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId || !billType || !accNo) return setErr("Fill all fields.");
    if (!amt || amt<=0)                 return setErr("Enter a valid amount.");
    if (amt > bank.balance)             return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`${billType} — ${accNo}`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Pay Bill" icon={<FileText size={17} />} color="amber" onClose={onClose}>
      {done ? <SuccessView message={`${billType} bill of ৳${Number(amount).toLocaleString()} paid.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Bill Type">
            <div className="relative">
              <select value={billType} onChange={e=>setBillType(e.target.value)} className={selectCls}>
                <option value="">-- Select bill --</option>
                {bills.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Account / Consumer No.">
            <input type="text" placeholder="Enter account number" value={accNo} onChange={e=>setAccNo(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Amount (৳)">
            <input type="number" placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pay From"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Pay Bill" color="bg-amber-500 hover:bg-amber-600" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. SAVINGS
════════════════════════════════════════════════════════════ */
function SavingsModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,  setBankId]  = useState("");
  const [goal,    setGoal]    = useState("");
  const [amount,  setAmount]  = useState("");
  const [period,  setPeriod]  = useState("Monthly");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  const periods = ["Weekly","Monthly","Quarterly","Yearly"];

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId || !goal)  return setErr("Select bank and enter a goal.");
    if (!amt || amt<=0)    return setErr("Enter a valid deposit amount.");
    if (amt > bank.balance) return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`Savings — ${goal} (${period})`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Savings Plan" icon={<PiggyBank size={17} />} color="emerald" onClose={onClose}>
      {done ? <SuccessView message={`৳${Number(amount).toLocaleString()} saved toward "${goal}".`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Savings Goal">
            <input type="text" placeholder="e.g. Emergency Fund, Vacation" value={goal} onChange={e=>setGoal(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Deposit Amount (৳)">
            <input type="number" placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Frequency">
            <div className="flex gap-2 flex-wrap">
              {periods.map(p => (
                <button type="button" key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${period===p ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"}`}>
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <Field label="From Bank"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Start Saving" color="bg-emerald-500 hover:bg-emerald-600" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. LOAN
════════════════════════════════════════════════════════════ */
function LoanModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,   setBankId]   = useState("");
  const [type,     setType]     = useState("Personal");
  const [amount,   setAmount]   = useState("");
  const [tenure,   setTenure]   = useState("12");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [err,      setErr]      = useState("");

  const types   = ["Personal","Home","Car","Business","Education"];
  const tenures = ["6","12","24","36","60"];
  const rate    = 9; // % per annum
  const emi     = amount ? Math.round((Number(amount) * (rate/1200)) / (1 - Math.pow(1+(rate/1200), -Number(tenure)))) : 0;

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId) return setErr("Select a bank.");
    if (!amt || amt<=0) return setErr("Enter a valid loan amount.");
    if (amt < 10000)    return setErr("Minimum loan amount is ৳10,000.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance + amt);
      addTransaction({ id:"tx"+Date.now(), type:"credit", bank:bank.bankName, desc:`${type} Loan Disbursed`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Apply for Loan" icon={<Building2 size={17} />} color="rose" onClose={onClose}>
      {done ? <SuccessView message={`৳${Number(amount).toLocaleString()} ${type} Loan disbursed to your account.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Loan Type">
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button type="button" key={t} onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${type===t ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Loan Amount (৳)">
            <input type="number" placeholder="Minimum ৳10,000" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tenure (Months)">
            <div className="flex gap-2">
              {tenures.map(t => (
                <button type="button" key={t} onClick={() => setTenure(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${tenure===t ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"}`}>
                  {t}m
                </button>
              ))}
            </div>
          </Field>
          {emi > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-rose-600 font-semibold">Estimated Monthly EMI</p>
              <p className="number-display text-lg font-extrabold text-rose-700">৳{emi.toLocaleString()}</p>
              <p className="text-[10px] text-rose-400 mt-0.5">@ {rate}% per annum · {tenure} months</p>
            </div>
          )}
          <Field label="Disburse To"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Apply Now" color="bg-rose-500 hover:bg-rose-600" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. INSURANCE
════════════════════════════════════════════════════════════ */
function InsuranceModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,  setBankId]  = useState("");
  const [plan,    setPlan]    = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  const plans = [
    { name:"Basic Life",       premium:500,  coverage:"৳5,00,000",  desc:"Term life coverage" },
    { name:"Health Shield",    premium:1200, coverage:"৳10,00,000", desc:"Hospitalization cover" },
    { name:"Motor Protect",    premium:800,  coverage:"৳3,00,000",  desc:"Vehicle insurance" },
    { name:"Family Protect",   premium:1500, coverage:"৳15,00,000", desc:"Family health plan" },
    { name:"Critical Illness", premium:950,  coverage:"৳8,00,000",  desc:"36 critical illnesses" },
  ];

  const selected = plans.find(p => p.name === plan);

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    if (!bankId || !plan) return setErr("Select bank and insurance plan.");
    if (selected.premium > bank.balance) return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - selected.premium);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`${plan} Insurance Premium`, amount:selected.premium, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Insurance" icon={<ShieldCheck size={17} />} color="teal" onClose={onClose}>
      {done ? <SuccessView message={`${plan} activated. Coverage: ${selected?.coverage}.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Choose Plan">
            <div className="space-y-2">
              {plans.map(p => (
                <button type="button" key={p.name} onClick={() => setPlan(p.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all
                    ${plan===p.name ? "border-teal-400 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-200"}`}>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.desc} · {p.coverage}</p>
                  </div>
                  <p className="text-sm font-extrabold text-teal-600 shrink-0 ml-3">৳{p.premium}/mo</p>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Pay From"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Activate Plan" color="bg-teal-500 hover:bg-teal-600" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   8. TOLL
════════════════════════════════════════════════════════════ */
function TollModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,  setBankId]  = useState("");
  const [tag,     setTag]     = useState("");
  const [amount,  setAmount]  = useState("200");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  const presets = [100,200,500,1000,2000];

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId || !tag)  return setErr("Enter your toll tag ID and select bank.");
    if (!amt || amt<=0)   return setErr("Select a recharge amount.");
    if (amt > bank.balance) return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`Toll Recharge — Tag ${tag}`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Toll Recharge" icon={<Car size={17} />} color="orange" onClose={onClose}>
      {done ? <SuccessView message={`Toll wallet recharged with ৳${Number(amount).toLocaleString()}.`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Toll Tag / RFID ID">
            <input type="text" placeholder="e.g. BD-TG-12345678" value={tag} onChange={e=>setTag(e.target.value.toUpperCase())} className={inputCls} />
          </Field>
          <Field label="Recharge Amount (৳)">
            <div className="flex gap-2 flex-wrap mb-2">
              {presets.map(p => (
                <button type="button" key={p} onClick={() => setAmount(String(p))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${amount===String(p) ? "bg-orange-500 text-white border-orange-500" : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"}`}>
                  ৳{p}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Custom amount" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pay From"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Recharge Toll" color="bg-orange-500 hover:bg-orange-600" />
        </form>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   9. DONATION
════════════════════════════════════════════════════════════ */
function DonationModal({ onClose }) {
  const { banks, updateBankBalance, addTransaction } = useBanks();
  const [bankId,  setBankId]  = useState("");
  const [org,     setOrg]     = useState("");
  const [amount,  setAmount]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  const orgs = [
    { name:"BRAC",            category:"Development" },
    { name:"Bidyanondo Foundation", category:"Education" },
    { name:"Save the Children BD", category:"Children"  },
    { name:"Ahsania Mission",      category:"Health"    },
    { name:"Manusher Jonno",       category:"Rights"    },
    { name:"Islamic Relief BD",    category:"Relief"    },
  ];
  const presets = [50,100,200,500,1000,2000];

  function handleSubmit(e) {
    e.preventDefault(); setErr("");
    const bank = banks.find(b=>b.id===bankId);
    const amt  = Number(amount);
    if (!bankId || !org)   return setErr("Select bank and organisation.");
    if (!amt || amt<=0)    return setErr("Enter a donation amount.");
    if (amt > bank.balance) return setErr("Insufficient balance.");
    setLoading(true);
    setTimeout(() => {
      updateBankBalance(bankId, bank.balance - amt);
      addTransaction({ id:"tx"+Date.now(), type:"debit", bank:bank.bankName, desc:`Donation — ${org}`, amount:amt, date:new Date().toISOString().split("T")[0] });
      setLoading(false); setDone(true);
    }, 1000);
  }

  return (
    <Modal title="Donation" icon={<Heart size={17} />} color="pink" onClose={onClose}>
      {done ? <SuccessView message={`৳${Number(amount).toLocaleString()} donated to ${org}. Thank you! 🙏`} onClose={onClose} /> : (
        <form onSubmit={handleSubmit}>
          <Field label="Organisation">
            <div className="space-y-2">
              {orgs.map(o => (
                <button type="button" key={o.name} onClick={() => setOrg(o.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-left transition-all
                    ${org===o.name ? "border-pink-400 bg-pink-50" : "border-slate-200 bg-white hover:border-pink-200"}`}>
                  <p className="text-sm font-semibold text-slate-800">{o.name}</p>
                  <span className="text-[10px] font-bold text-pink-500 bg-pink-100 px-2 py-0.5 rounded-full">{o.category}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Amount (৳)">
            <div className="flex gap-2 flex-wrap mb-2">
              {presets.map(p => (
                <button type="button" key={p} onClick={() => setAmount(String(p))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${amount===String(p) ? "bg-pink-500 text-white border-pink-500" : "bg-white text-slate-600 border-slate-200 hover:border-pink-300"}`}>
                  ৳{p}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Or enter amount" value={amount} onChange={e=>setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pay From"><BankSelect value={bankId} onChange={e=>setBankId(e.target.value)} banks={banks} /></Field>
          {err && <p className="text-xs text-rose-500 mb-3 bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
          <SubmitBtn loading={loading} label="Donate Now" color="bg-pink-500 hover:bg-pink-600" />
        </form>
      )}
    </Modal>
  );
}
