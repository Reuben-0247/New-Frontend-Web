import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import "./styles/main.scss";

import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Fero Events",
    template: "%s | Fero Events",
  },
  description:
    "Fero Events is a modern live streaming and event management platform for hosting, broadcasting, and clipping live events.",
  keywords: [
    "live streaming",
    "event platform",
    "video clipping",
    "online events",
    "Fero Events",
  ],
  openGraph: {
    title: "Fero Events",
    description: "Host, stream, and clip live events easily with Fero Events.",
    url: "https://feroevent.com",
    siteName: "Fero Events",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      const theme = localStorage.getItem("THEME");
      if (theme === "dark") document.documentElement.classList.add("dark");
    `,
          }}
        />
      </head>
      <body className={`${nunitoSans.variable} antialiased`}>
        <NextTopLoader
          color="#0062ff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #5694f7,0 0 5px #5694f7"
        />
        <ToastContainer position="top-right" />
        {children}
      </body>
    </html>
  );
}
