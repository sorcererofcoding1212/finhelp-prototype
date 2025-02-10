import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React, { ReactNode } from "react";
import ToastWrapper from "@/context/ToastWrapper";
import SessionWrapper from "@/context/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinHelp",
  description: "Authentication page for FinHelp application",
  icons: "favicon.png",
};

const AuthLayout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <ToastWrapper>{children}</ToastWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
};

export default AuthLayout;
