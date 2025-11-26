import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/context/UserContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ResumeXpert - AI Resume Analyzer & Builder",
  description: "Create and analyze resumes with AI-powered tools for the perfect job application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </UserProvider>
      </body>
    </html>
  );
}
