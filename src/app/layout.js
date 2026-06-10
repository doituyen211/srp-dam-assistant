import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "SRP DAM - AI Trợ Lý Soạn & Quản Lý Đề Tài",
  description:
    "Nền tảng AI hỗ trợ sinh viên soạn thảo, quản lý đề tài nghiên cứu khoa học và kết nối với giảng viên hướng dẫn.",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased scroll-smooth`}
    >
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
