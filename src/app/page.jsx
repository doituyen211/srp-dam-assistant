"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    title: "AI hỗ trợ hoàn thiện đề xuất",
    description:
      "Phân tích vấn đề, mục tiêu, phương pháp và tính khả thi để sinh viên chỉnh sửa đề cương có cấu trúc hơn.",
    icon: (
      <path d="M7.75 8.25h8.5M7.75 12h8.5M7.75 15.75h5M5.25 3.75h13.5v16.5H5.25z" />
    ),
  },
  {
    title: "Gợi ý giảng viên hướng dẫn",
    description:
      "Đề xuất giảng viên phù hợp theo lĩnh vực nghiên cứu, chuyên môn và tải hướng dẫn hiện tại.",
    icon: (
      <path d="M12 4.75 4.75 8.5 12 12.25l7.25-3.75L12 4.75Zm-4.75 6v4.5c1.35 1.35 2.95 2 4.75 2s3.4-.65 4.75-2v-4.5" />
    ),
  },
  {
    title: "Theo dõi tiến độ & hỗ trợ hội đồng",
    description:
      "Tập trung trạng thái, phản hồi, rubric và dữ liệu review để quá trình xét duyệt minh bạch hơn.",
    icon: (
      <path d="M5 18.75h14M7.25 15.25v-4.5M12 15.25v-8.5M16.75 15.25v-6" />
    ),
  },
];

function FeatureIcon({ children }) {
  return (
    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-deep-green text-white">
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <nav className="sticky top-0 z-40 border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <div>
            <h1 className="text-[15px] font-semibold tracking-[0.04em]">
              SRP D&M Assistant
            </h1>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:block">
              Student Research Platform
            </p>
          </div>
          <Link href="/login">
            <Button variant="primary" className="px-5 py-2 text-sm">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex rounded-full bg-deep-green px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white">
                AI-assisted research management
              </div>
              <h2 className="max-w-4xl text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-ink md:text-6xl">
                AI Trợ Lý Soạn & Quản Lý Đề Tài Nghiên Cứu
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-body-muted">
                Nền tảng hỗ trợ sinh viên xây dựng đề xuất nghiên cứu chặt chẽ,
                kết nối giảng viên phù hợp và giúp hội đồng theo dõi tiến độ xét
                duyệt trong một không gian làm việc chuyên nghiệp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login">
                  <Button variant="primary" className="w-full px-7 py-3 sm:w-auto">
                    Bắt đầu ngay
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" className="w-full px-7 py-3 sm:w-auto">
                    Xem demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[22px] bg-soft-stone p-4">
              <div className="rounded-xl bg-primary p-5 text-white shadow-card">
                <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
                  Proposal intelligence
                </div>
                <div className="space-y-3">
                  {["Problem clarity", "Method feasibility", "Lecturer match"].map(
                    (label, index) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/10 bg-white/[0.06] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80">{label}</span>
                          <span className="font-mono text-xs text-white">
                            {[86, 78, 92][index]}%
                          </span>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-[#4ade80]"
                            style={{ width: `${[86, 78, 92][index]}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-hairline bg-app-bg px-5 py-14 md:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">
              Vấn đề nghiên cứu cần một quy trình rõ ràng hơn.
            </h3>
            <div className="space-y-4 text-base leading-7 text-body-muted">
              <p>
                Sinh viên thường gặp khó khăn khi định hình vấn đề, mục tiêu và
                phương pháp nghiên cứu. Những thiếu sót nhỏ trong đề cương có thể
                làm quá trình xét duyệt kéo dài.
              </p>
              <p>
                SRP D&M Assistant gom việc soạn thảo, phản hồi AI, matching giảng
                viên và review hội đồng vào một luồng làm việc nhất quán.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-10 text-center text-3xl font-medium tracking-[-0.02em] text-ink">
              Tính năng chính
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-soft-stone">
                  <CardContent className="p-6">
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <h4 className="text-base font-medium text-ink">
                      {feature.title}
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-body-muted">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-deep-green px-5 py-16 text-white md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
              Academic workflow
            </p>
            <h3 className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
              Sẵn sàng nâng cao chất lượng đề tài của bạn?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70">
              Đăng nhập để trải nghiệm luồng demo cho sinh viên, reviewer,
              giảng viên và quản trị viên.
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button
                  variant="primary"
                  className="bg-white px-8 py-3 text-primary hover:bg-soft-stone"
                >
                  Đi tới đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-primary px-6 py-8 text-center text-sm text-white/55">
        <p>© 2026 SRP D&M Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}
