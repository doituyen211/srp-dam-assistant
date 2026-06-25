import "./globals.css";

export const metadata = {
  title: "SRP DAM - AI Trợ Lý Soạn & Quản Lý Đề Tài",
  description:
    "Nền tảng AI hỗ trợ sinh viên soạn thảo, quản lý đề tài nghiên cứu khoa học và kết nối với giảng viên hướng dẫn.",
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="antialiased scroll-smooth">
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
