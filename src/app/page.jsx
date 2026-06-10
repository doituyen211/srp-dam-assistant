"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">SRP DAM</h1>
          <Link href="/login">
            <Button variant="primary" className="text-sm">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mt-16 py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            AI Trợ Lý Soạn & Quản Lý Đề Tài Nghiên Cứu
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Giải pháp toàn diện giúp sinh viên soạn thảo đề tài chất lượng, nâng
            cao khả năng nghiên cứu khoa học với hỗ trợ AI thông minh.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="primary" className="text-lg px-8 py-3">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Vấn đề</h3>
          <div className="space-y-4 text-slate-700">
            <p>
              Sinh viên thường gặp khó khăn trong quá trình soạn thảo đề tài
              nghiên cứu: không biết cách định hình vấn đề rõ ràng, xây dựng mục
              tiêu hợp lý, hay lựa chọn phương pháp phù hợp.
            </p>
            <p>
              Việc tìm kiếm giảng viên hướng dẫn phù hợp cũng là thách thức lớn,
              cũng như theo dõi tiến độ dự án một cách hiệu quả.
            </p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Tính năng chính
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card>
              <CardContent className="py-6 space-y-3">
                <div className="text-4xl">🤖</div>
                <h4 className="text-lg font-semibold text-slate-900">
                  AI Hỗ Trợ Hoàn Thiện Đề Xuất
                </h4>
                <p className="text-sm text-slate-600">
                  Hệ thống AI phân tích và cung cấp phản hồi chi tiết giúp bạn
                  hoàn thiện từng khía cạnh của đề tài: vấn đề, mục tiêu, phương
                  pháp.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card>
              <CardContent className="py-6 space-y-3">
                <div className="text-4xl">🎓</div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Gợi Ý Giảng Viên Hướng Dẫn
                </h4>
                <p className="text-sm text-slate-600">
                  Nền tảng tự động gợi ý giảng viên phù hợp dựa trên lĩnh vực
                  nghiên cứu, expertise, và công việc hiện tại.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card>
              <CardContent className="py-6 space-y-3">
                <div className="text-4xl">📊</div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Theo Dõi Tiến Độ & Hỗ Trợ
                </h4>
                <p className="text-sm text-slate-600">
                  Dashboard trực quan giúp bạn quản lý tiến độ dự án, nhận phản
                  hồi từ hội đồng, và điều chỉnh kế hoạch.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold">
            Sẵn sàng nâng cao chất lượng đề tài của bạn?
          </h3>
          <p className="text-lg text-blue-100">
            Tham gia hệ thống ngay để nhận hỗ trợ AI và gợi ý từ các chuyên gia.
          </p>
          <Link href="/login">
            <Button
              variant="primary"
              className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-3"
            >
              Bắt đầu miễn phí
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-300 text-center text-sm">
        <p>© 2026 SRP DAM Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}
