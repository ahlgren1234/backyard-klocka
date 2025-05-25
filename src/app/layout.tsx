import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Backyard Klocka",
  description: "Din digitala assistent för backyard och frontyard löpartävlingar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="sv">
        <body className={inter.className}>
          <header className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                Backyard Klocka
              </Link>
              <nav className="flex items-center gap-4">
                <SignedIn>
                  <Link href="/dashboard" className="text-sm hover:underline">
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm hover:underline">
                      Logga in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-sm hover:underline">
                      Skapa konto
                    </button>
                  </SignUpButton>
                </SignedOut>
              </nav>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}