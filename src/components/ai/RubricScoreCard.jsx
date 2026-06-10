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
  const totalScore = review.totalScore ?? 0;
  const totalPercent = Math.min(totalScore * 10, 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Đánh giá theo tiêu chí</CardTitle>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Rubric score
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold leading-none text-action-blue">
              {totalScore.toFixed(1)}
            </div>
            <p className="mt-1 text-xs text-muted">/10</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="h-2 overflow-hidden rounded-full bg-soft-stone">
          <div
            className="h-full rounded-full bg-action-blue transition-all"
            style={{ width: `${totalPercent}%` }}
          />
        </div>

        {criteria.map((criterion) => (
          <div
            key={criterion.name}
            className="border-b border-hairline pb-3 last:border-b-0 last:pb-0"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-ink">{criterion.name}</span>
              <span className="font-mono text-xs font-medium text-action-blue">
                {criterion.score}/{criterion.maxScore}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-soft-stone">
              <div
                className="h-full rounded-full bg-action-blue transition-all"
                style={{
                  width: `${Math.min((criterion.score / criterion.maxScore) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}

        {review.comments && (
          <div className="rounded-lg bg-soft-stone p-4">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Nhận xét
            </p>
            <p className="text-sm leading-6 text-ink">{review.comments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
