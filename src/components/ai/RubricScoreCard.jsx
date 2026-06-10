"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

/**
 * RubricScoreCard - Display rubric scores
 * @param {Object} props
 * @param {Object} props.review - Rubric review object with criteria and totalScore
 */
export function RubricScoreCard({ review }) {
  if (!review) return null;

  const criteria = review.criteria || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá theo tiêu chí</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Criteria Rows */}
        {criteria.map((criterion) => (
          <div
            key={criterion.name}
            className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-b-0"
          >
            <span className="text-sm font-medium text-slate-700">
              {criterion.name}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {criterion.score}/{criterion.maxScore}
            </span>
          </div>
        ))}

        {/* Total Score */}
        <div className="pt-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
          <span className="font-semibold text-slate-900">Tổng điểm</span>
          <span className="text-lg font-bold text-blue-600">
            {review.totalScore?.toFixed(1)}
          </span>
        </div>

        {/* Comments */}
        {review.comments && (
          <div className="pt-3">
            <p className="text-xs font-medium text-slate-600 mb-1">Nhận xét:</p>
            <p className="text-sm text-slate-700">{review.comments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
