import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/shared/providers/query-provider";
import { MswProvider } from "@/shared/providers/msw-provider";
import { AuthProvider } from "@/features/auth";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BdayList",
  description:
    "Crie sua lista de presentes de aniversário e compartilhe com seus convidados.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>
        <QueryProvider>
          <MswProvider>
            <AuthProvider>{children}</AuthProvider>
          </MswProvider>
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
