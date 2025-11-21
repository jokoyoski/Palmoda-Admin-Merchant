// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Sidebar from "./_components/SideBar";
import {AuthProvider} from "./_lib/AuthContext"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: {
    default: "Palmoda Admin Merchant",
    template: "%s | Scale Your Business on Palmoda",
  },
  description: "Manage Vendors selling on the platform.",
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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-white  text-black">
        <AuthProvider>
        {/* Fixed Header */}
        <Header />

        <div className="flex pt-[50px] h-[calc(100vh-50px)]">
          {/* Sidebar - fixed height with independent scroll */}
          <Sidebar />

          {/* Main Content - scrollable separately */}
          <main className="flex-1 min-h-screen overflow-y-auto">
            {children}
          </main>
        </div>
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
