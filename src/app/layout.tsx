import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Notes Server | Productivity Redefined",
  description: "Notes, YouTube Summarizer, and Deep Research Tool powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
