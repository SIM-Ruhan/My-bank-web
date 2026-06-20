# BankFlow — File Roadmap

## Project: Next.js Banking Dashboard with Authentication (App Router, JavaScript)

---

## Directory Tree

```
bankflow/
├── package.json                          # Dependencies & scripts
├── jsconfig.json                         # "@/" path alias → ./src/
├── next.config.js                        # Next.js configuration
├── tailwind.config.js                    # Tailwind CSS theme & colors
├── postcss.config.js                     # PostCSS (required for Tailwind)
├── .gitignore
│
└── src/
    ├── app/
    │   ├── layout.js                     # Root layout — wraps app in <Providers>
    │   ├── Providers.js                  # AuthProvider → ToastProvider → BankProvider
    │   ├── globals.css                   # Global styles, fonts, animations
    │   ├── page.js                       # Home / Dashboard (guest + authed states)
    │   │
    │   ├── login/page.js                 # Login form
    │   ├── register/page.js              # Registration form
    │   ├── add-bank/page.js              # Add Bank form (route-guarded)
    │   ├── tax-calculation/page.js       # Tax breakdown (route-guarded)
    │   ├── transactions/page.js          # Transaction history (route-guarded)
    │   └── profile/page.js               # User profile (route-guarded)
    │
    ├── components/
    │   ├── Navbar.js                     # Logo | balance | profile dropdown OR Login/Register
    │   ├── Footer.js
    │   ├── BankCard.js                   # Bank tile + delete modal
    │   ├── QuickActions.js               # 10 guarded service buttons + their modals
    │   └── AddBankSection.js             # Guarded "Add Bank" CTA
    │
    ├── context/
    │   ├── AuthContext.js                # register / login / logout, user storage
    │   ├── ToastContext.js               # Global toast notification system
    │   └── BankContext.js                # Per-user banks & transactions
    │
    └── lib/
        ├── utils.js                      # formatCurrency, maskAccountNo, BANK_LIST
        └── useAuthGuard.js                # guard() hook — toast + redirect if logged out
```

---

## Authentication Architecture

### `AuthContext.js`
- Stores **all registered users** under `bankflow_users_v1` in `localStorage`
- Stores the **active session** (current user's email) under `bankflow_session_v1`
- `register({ name, email, phone, password })` — validates, rejects duplicate emails, adds user
- `login({ email, password })` — validates credentials, sets session
- `logout()` — clears session
- Exposes `currentUser`, `isAuthenticated`, `ready` (true once localStorage has been read client-side)

### `BankContext.js`
- Banks & transactions are now **scoped per user**, keyed as `bankflow_data_v2_<email>`
- When `currentUser` changes (login/logout), the bank/transaction state reloads for that user
- **Logged out → `banks = []`, `transactions = []` → Total Balance shows ৳0**
- Every mutating function (`addBank`, `deleteBank`, etc.) checks `isAuthenticated` internally as a second line of defense

### `useAuthGuard.js`
- A single reusable hook: `const guard = useAuthGuard()`
- Call `guard()` before any protected action
- If not logged in: shows a **"Login required!"** toast and redirects to `/login`, returns `false`
- If logged in: returns `true`, action proceeds
- Used in: `QuickActions.js` (all 10 buttons) and `AddBankSection.js`

### Route-level protection
In addition to button-level guards, the following pages independently redirect unauthenticated visitors who reach them via direct URL:
- `/add-bank`
- `/tax-calculation`
- `/transactions`
- `/profile`

Each shows a brief loading state, then `router.replace("/login?reason=protected")` with a toast if not authenticated.

---

## User Flow

```
Guest visits site
  │
  ├─ Navbar shows: Login | Register buttons
  ├─ Total Balance: ৳0
  ├─ "My Bank Accounts": empty state, no list
  ├─ Clicks any Quick Action / Add Bank
  │     → toast "Login required!" → redirected to /login
  │
  ├─ Clicks Register → fills form → account created
  │     → redirected to /login?registered=1 (success banner shown)
  │
  └─ Logs in → toast "Welcome back, {name}!" → redirected to /
        → Navbar now shows profile dropdown (See Profile / Transactions / Log Out)
        → Banks/transactions for THIS user load from localStorage
        → Can now: add banks, delete banks, use all 9 quick actions, view tax page
```

---

## How to Run

```bash
npm install
npm run dev
# → http://localhost:3000
```

Try it: register a new account → get redirected to login → log in → add a bank → use Quick Actions (e.g. Mobile Recharge) → balances update live → log out → balance resets to ৳0 and banks disappear (they're still saved — log back in to see them again).

---

## Key Design Decisions

- **No backend** — this is a fully client-side demo. All "auth" and "banking" data lives in the browser's `localStorage`, namespaced per user email.
- **Plaintext passwords** — acceptable only because this is a demo with no real backend; never do this in production.
- **Per-user data isolation** — switching accounts (logout → login as someone else) shows that user's own banks, not the previous user's.
- **Defense in depth** — auth is checked at three layers: UI (buttons hidden/guarded), route (redirect on direct URL access), and data (context functions refuse to mutate if not authenticated).
