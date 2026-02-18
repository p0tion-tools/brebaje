import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/shared/Header";
import { Footer } from "./components/shared/Footer";
import { Poppins, Roboto_Mono } from "next/font/google";
import { QueryClientProviderLayout } from "./components/layouts/QueryClientProviderLayout";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata: Metadata = {
  title: "P0tion",
  description: "Toolkit for Groth16 Phase 2 Trusted Setup ceremonies.",
  icons: {
    icon: "/favicon.svg",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${poppins.variable} ${robotoMono.variable} min-h-screen bg-background antialiased flex flex-col`}
      >
        <AuthProvider>
          <QueryClientProviderLayout>
            <Header />
            <main className="flex-1 relative">{children}</main>
            <Footer />
          </QueryClientProviderLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
