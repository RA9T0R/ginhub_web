import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

const SpaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GINHUB | Food Delivery",
  description: "ระบบสั่งอาหารออนไลน์สุดเจ๋ง ส่งตรงถึงหน้าบ้านคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}
        className={`${SpaceGrotesk.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          <AuthProvider>
            <div className="min-h-screen bg-orange-50 dark:bg-zinc-900 transition-colors duration-300">
              {children}
            </div>
            <Toaster
              position="top-center"
                toastOptions={{
                  duration: 3000, // ให้โชว์ 3 วินาทีแล้วหายไป
                  style: {
                      background: '#333',
                      color: '#fff',
                      borderRadius: '12px',
                  },
                  success: {
                     style: { background: '#22c55e' }, // สีเขียวเวลาสำเร็จ
                  },
                  error: {
                      style: { background: '#ef4444' }, // สีแดงเวลา Error
                  },
              } }
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
