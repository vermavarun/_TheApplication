import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Complete Application",
  description: "All Software Products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-6 lg:px-10">
            <span className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
              The Application
            </span>
          <div className="flex flex-1 items-center justify-end gap-4">
              <input
                type="search"
                placeholder="Search…"
                className="w-full max-w-sm rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
              />
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <span>User</span>
            </div>
          </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
