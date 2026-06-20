import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "MyBank — All Your Banks, One Place",
  description: "Manage all your bank accounts in a single, elegant dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
