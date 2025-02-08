import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getUser } from "@/actions/user";
import AppBar from "@/components/AppBar";
import SessionWrapper from "@/context/SessionWrapper";
import ErrorPage from "@/components/ErrorPage";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUser();
  if (!session || !session.user || !session.user.name) {
    return <ErrorPage />;
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <AppBar name={session.user.name} />
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
