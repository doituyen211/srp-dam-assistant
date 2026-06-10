"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Phản hồi AI</CardTitle>
          <div className="text-sm font-semibold text-blue-600">
            Điểm: {feedback.score?.toFixed(1)}/10
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Warning */}
        <Alert type="info" title="Lưu ý">
          Phản hồi AI chỉ mang tính chất hỗ trợ. Luôn lấy ý kiến từ các chuyên
          gia để có đánh giá chính xác.
        </Alert>

        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-green-700 mb-2">
              ✓ Điểm mạnh
            </h3>
            <ul className="space-y-1">
              {feedback.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-green-600">→</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {feedback.weaknesses && feedback.weaknesses.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-amber-700 mb-2">
              ⚠ Điểm yếu
            </h3>
            <ul className="space-y-1">
              {feedback.weaknesses.map((weakness, idx) => (
                <li key={idx} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-amber-600">→</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-blue-700 mb-2">
              💡 Gợi ý
            </h3>
            <ul className="space-y-1">
              {feedback.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-blue-600">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
