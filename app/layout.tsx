import "./globals.css";
import { Inter } from "next/font/google";
import ThemeRegistry from "./components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bates DCS Program Assistant",
  description:
    "Digital and Computational Studies Program Assistant for Bates College",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
