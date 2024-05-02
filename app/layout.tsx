import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import QueryProviders from "@/components/query-provider";

// const inter = Inter({ subsets: ["latin"] });

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "File Management",
  description: "A simple file management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProviders>
      <html lang="en">
        <body className={roboto_mono.className}>
          {children}
          <Toaster />
        </body>
      </html>
      </QueryProviders>
    </ClerkProvider >
  );
}
