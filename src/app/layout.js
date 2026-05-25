import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "Bhabhi Thula Tracker",
  description: "Track your Bhabhi Thula card game losses like a pro!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64 min-h-screen transition-all duration-300">
              <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1a5c35",
                color: "#d4af37",
                border: "1px solid #d4af37",
                fontFamily: "Trebuchet MS, sans-serif",
              },
              success: {
                iconTheme: { primary: "#d4af37", secondary: "#1a5c35" },
              },
              error: {
                style: {
                  background: "#7f1d1d",
                  color: "#fca5a5",
                  border: "1px solid #ef4444",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
