import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import {Header} from "@/components/header"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"], // pesos que quiser usar
  display: "swap",
});


export const metadata: Metadata = {
  title: "Ovitrack",
  description: "Monitoramento de ovitrampas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
