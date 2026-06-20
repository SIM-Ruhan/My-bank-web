export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency", currency: "BDT", maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount) {
  return new Intl.NumberFormat("en-BD").format(amount);
}

export function maskAccountNo(accountNo) {
  const str = String(accountNo);
  return "**** " + str.slice(-4);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export const BANK_LIST = [
  "Dutch-Bangla Bank (DBBL)",
  "BRAC Bank",
  "Islami Bank Bangladesh",
  "Sonali Bank",
  "Agrani Bank",
  "Janata Bank",
  "Rupali Bank",
  "AB Bank",
  "Dhaka Bank",
  "Eastern Bank (EBL)",
  "Mercantile Bank",
  "Mutual Trust Bank (MTB)",
  "National Bank",
  "Prime Bank",
  "Pubali Bank",
  "Southeast Bank",
  "Standard Bank",
  "The City Bank",
  "Trust Bank",
  "United Commercial Bank (UCBL)",
];
