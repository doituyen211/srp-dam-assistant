"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

/**
 * RubricScoreCard — Enhanced with criterion descriptions, improvement hints, reviewer comments
 */
export function RubricScoreCard({ review }) {
  if (!review) return null;

  const criteria = review.criteria || [];
  const totalScore = review.totalScore ?? 0;
  const totalPercent = Math.min((totalScore / 10) * 100, 100);

  const getScoreColor = (score, maxScore) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 80) return "bg-success-bg text-success";
    if (pct >= 60) return "bg-warning-bg text-warning";
    return "bg-danger-bg text-danger";
  };

  const getBarColor = (score, maxScore) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 80) return "bg-success";
    if (pct >= 60) return "bg-warning";
    return "bg-danger";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Rubric Review</CardTitle>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {review.reviewer ? `Reviewed by ${review.reviewer}` : "Reviewer assessment"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold leading-none text-primary">
              {totalScore.toFixed(1)}
              <span className="text-sm text-body-muted">/10</span>
            </div>
            <p className="mt-1 text-xs text-body-muted">
              {review.timestamp
                ? new Date(review.timestamp).toLocaleDateString("en-US")
                : ""}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Overall progress */}
        <div className="h-2 overflow-hidden rounded-full bg-subdued">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${totalPercent}%` }}
          />
        </div>

        {/* Criteria list */}
        {criteria.length === 0 ? (
          <Alert type="info">No rubric criteria scored.</Alert>
        ) : (
          <div className="space-y-4">
            {criteria.map((criterion) => {
              const scorePct = (criterion.score / criterion.maxScore) * 100;
              return (
                <div
                  key={criterion.id || criterion.name}
                  className="rounded border border-hairline p-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">
                          {criterion.label || criterion.name}
                        </span>
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${getScoreColor(criterion.score, criterion.maxScore)}`}
                        >
                          {criterion.score}/{criterion.maxScore}
                        </span>
                      </div>

                      {criterion.description && (
                        <p className="mt-1 text-xs text-body-muted">
                          {criterion.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-subdued">
                    <div
                      className={`h-full rounded-full ${getBarColor(criterion.score, criterion.maxScore)}`}
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>

                  {/* AI observation */}
                  {criterion.aiObservation && (
                    <div className="mt-2 rounded bg-subdued/50 px-2 py-1.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted">
                        AI observation
                      </p>
                      <p className="mt-0.5 text-xs text-body-muted">
                        {criterion.aiObservation}
                      </p>
                    </div>
                  )}

                  {/* Reviewer comment */}
                  {criterion.reviewerComment && (
                    <div className="mt-1.5 rounded border border-info/20 bg-info-bg/30 px-2 py-1.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-info">
                        Reviewer comment
                      </p>
                      <p className="mt-0.5 text-xs text-ink">
                        {criterion.reviewerComment}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Overall comment */}
        {review.comments && (
          <div className="rounded border border-hairline bg-subdued p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Overall Assessment
            </p>
            <p className="mt-1.5 text-sm leading-6 text-ink">
              {review.comments}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
