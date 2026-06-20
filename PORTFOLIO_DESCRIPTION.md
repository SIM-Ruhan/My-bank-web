# BankFlow — Unified Bank Account Dashboard

**A Next.js banking aggregator concept that lets users link multiple bank accounts and manage them from a single, secure dashboard.**

---

## One-line summary

> BankFlow is a responsive Next.js web app that simulates a "financial super-app" — letting a user register, log in, link multiple bank accounts, and perform transfers, bill payments, recharges, donations, loans, and tax calculations, all from one unified dashboard with real-time balance tracking.

---

## Project Description (for portfolio / resume)

**BankFlow** is a full front-end simulation of a multi-bank account aggregator, built with **Next.js (App Router)** and **Tailwind CSS**. The core idea: instead of juggling five different banking apps, a user links all their accounts into one place and manages everything — balances, transfers, bills, taxes — from a single screen.

The project includes a complete **authentication system** (registration, login, session persistence, and per-user data isolation) built entirely client-side using React Context and `localStorage`, simulating how a real auth-gated fintech product would behave without requiring a backend. Guests see a locked-down, zero-balance view of the dashboard; every protected action — adding a bank, transferring funds, paying a bill — is guarded both at the UI level and the route level, redirecting unauthenticated users to login with a toast notification.

Once logged in, users can link unlimited bank accounts via a validated form, see them rendered as elegant gradient "credit-card" style tiles in a responsive grid, and remove any account through a confirmation modal. A **Quick Actions** panel offers ten real banking workflows — Balance Transfer, Mobile Recharge, Bill Payment, Savings, Loans, Insurance, Toll Recharge, Donations, and more — each implemented as its own interactive modal that validates input, deducts from the correct linked account, and logs a transaction in real time. A dedicated **Tax Calculation** page computes a flat 5% tax per linked bank, visualizes the breakdown, and lets users "pay" the tax or download a generated tax report.

The UI was designed with attention to visual polish: a custom indigo/violet color system, three paired Google Fonts (display, body, and monospace for currency figures), glassmorphism navigation, micro-interactions (hover lifts, animated modals, toast notifications), and full responsiveness from mobile to desktop.

---

## Key Features

- 🔐 **Full authentication flow** — registration, login, session persistence, per-user data isolation
- 🛡️ **Route + action-level guarding** — protected pages and buttons redirect guests to login with a toast
- 🏦 **Multi-bank account linking** — add unlimited accounts via a validated form
- 💳 **Visual bank cards** — gradient-themed tiles with masked account numbers
- 🗑️ **Delete confirmation modal** — safely unlink any account
- ⚡ **10 functional Quick Actions** — Balance Transfer, Mobile Recharge, Payment, Pay Bill, Savings, Loan, Insurance, Toll, Donation — each a real interactive flow that updates live balances
- 🧮 **Automated tax calculator** — flat 5% per bank, with Pay Tax and Download Tax Paper
- 📊 **Transaction history** — searchable, filterable by type and bank
- 👤 **User profile** — account overview, linked banks, financial summary
- 📱 **Fully responsive** — mobile-first grid layouts throughout
- 🎨 **Custom design system** — Tailwind CSS, Google Fonts, gradient theming, smooth animations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS + custom CSS animations |
| Icons | Lucide React |
| State Management | React Context API (Auth, Toast, Bank contexts) |
| Persistence | Browser `localStorage` (no backend — fully client-side demo) |
| Fonts | Plus Jakarta Sans, DM Sans, JetBrains Mono (Google Fonts) |

---

## What This Project Demonstrates

- Structuring a multi-page Next.js App Router application with shared global state
- Designing and implementing a complete client-side authentication system from scratch
- Building reusable, composable React Context providers with clear separation of concerns (Auth / Toast / Data)
- Defense-in-depth access control (UI guards + route guards + data-layer guards)
- Form validation and multi-step user flows (register → login → dashboard)
- Component-driven UI architecture with a consistent design system
- Responsive, mobile-first layout design with Tailwind CSS
- Thoughtful UX details: toast notifications, modals, loading states, empty states, success animations

---

## Possible Future Enhancements

- Replace `localStorage` with a real backend (Node/Express + PostgreSQL or MongoDB) and JWT-based auth
- Real bank integration via Open Banking APIs (e.g. Plaid-style aggregation)
- Dark mode
- Multi-currency support
- Push notifications for transactions
- Two-factor authentication
