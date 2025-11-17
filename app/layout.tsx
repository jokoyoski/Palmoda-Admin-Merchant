// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Sidebar from "./_components/SideBar";

export const metadata: Metadata = {
  title: {
    default: "Palmoda Merchant",
    template: "%s | Scale Your Business on Palmoda",
  },
  description:
    "oin thousands of top sellers to list, manage, and sell your products to a wider audience..",
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
      <body className="min-h-screen  text-black">
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
      </body>
    </html>
  );
}
