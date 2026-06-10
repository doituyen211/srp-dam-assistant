"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";

function FeedbackList({ title, tone, items = [] }) {
  if (!items.length) return null;

  const toneClasses = {
    success: {
      heading: "text-success",
      rule: "border-l-[#4ade80]",
      dot: "bg-[#4ade80]",
    },
    warning: {
      heading: "text-warning",
      rule: "border-l-coral",
      dot: "bg-coral",
    },
    info: {
      heading: "text-action-blue",
      rule: "border-l-action-blue",
      dot: "bg-action-blue",
    },
  };

  const styles = toneClasses[tone] || toneClasses.info;

  return (
    <section>
      <h3 className={`mb-3 text-sm font-medium ${styles.heading}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`border-l-2 bg-[#fafafa] py-2 pl-3 pr-2 text-sm leading-6 text-ink ${styles.rule}`}
          >
            <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * AIFeedbackPanel - Display AI feedback with strengths, weaknesses, suggestions
 * @param {Object} props
 * @param {Object} props.feedback - AI feedback object
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.isEmpty - Whether feedback hasn't been generated
 */
export function AIFeedbackPanel({
  feedback,
  loading = false,
  isEmpty = false,
}) {
  if (loading) {
    return <LoadingState message="Đang xử lý phản hồi AI..." />;
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert type="info" title="Chưa có phản hồi">
            Hãy chạy AI phân tích để nhận phản hồi chi tiết về đề tài của bạn.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!feedback) return null;

  const weaknesses = feedback.weaknesses || feedback.improvements || [];
  const suggestions = feedback.suggestions || [];
  const score = feedback.score ?? 0;
  const scorePercent = score > 10 ? Math.min(score, 100) : Math.min(score * 10, 100);
  const scoreLabel = score > 10 ? `${Math.round(score)}/100` : `${score.toFixed(1)}/10`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Phản hồi AI</CardTitle>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Assistant review
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold leading-none text-deep-green">
              {scoreLabel}
            </div>
            <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-soft-stone">
              <div
                className="h-full rounded-full bg-deep-green transition-all"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert type="info" title="Lưu ý">
          Phản hồi AI chỉ mang tính chất hỗ trợ. Luôn lấy ý kiến từ các chuyên
          gia để có đánh giá chính xác.
        </Alert>

        {feedback.summary && (
          <div className="rounded-lg bg-soft-stone p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Summary
            </p>
            <p className="mt-2 text-sm leading-6 text-ink">{feedback.summary}</p>
          </div>
        )}

        <FeedbackList title="Điểm mạnh" tone="success" items={feedback.strengths} />
        <FeedbackList title="Cần cải thiện" tone="warning" items={weaknesses} />
        <FeedbackList title="Gợi ý tiếp theo" tone="info" items={suggestions} />
      </CardContent>
    </Card>
  );
}
