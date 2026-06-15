"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { HumanDecisionNotice } from "@/components/proposal/HumanDecisionNotice";
import { READINESS_LEVELS } from "@/lib/constants";

function IssueList({ title, tone, items = [] }) {
  if (!items.length) return null;

  const toneClasses = {
    success: "text-success border-l-success",
    warning: "text-warning border-l-warning",
    danger: "text-danger border-l-danger",
    info: "text-info border-l-info",
  };

  return (
    <section>
      <h4 className={`mb-2 text-xs font-semibold uppercase tracking-[0.06em] ${toneClasses[tone]?.split(" ")[0] || "text-muted"}`}>
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, idx) => {
          const itemText = typeof item === "string" ? item : item.description || item.instruction || "";
          const severity = item.severity;
          return (
            <li
              key={idx}
              className={`border-l-2 bg-subdued/50 py-1.5 pl-3 pr-2 text-xs leading-5 text-body-muted ${
                toneClasses[tone]?.split(" ")[1] || "border-l-hairline"
              }`}
            >
              {severity && (
                <span
                  className={`mr-1.5 inline-block rounded px-1 py-0.5 font-mono text-[9px] uppercase ${
                    severity === "high"
                      ? "bg-danger-bg text-danger"
                      : severity === "medium"
                        ? "bg-warning-bg text-warning"
                        : "bg-info-bg text-info"
                  }`}
                >
                  {severity}
                </span>
              )}
              {itemText}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * AIFeedbackPanel — Enhanced with readiness, confidence, section feedback, advisory notice
 */
export function AIFeedbackPanel({
  feedback,
  loading = false,
  isEmpty = false,
}) {
  if (loading) {
    return (
      <div className="rounded border border-hairline bg-canvas p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
          <div className="h-4 w-48 animate-pulse rounded bg-subdued" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full animate-pulse rounded bg-subdued" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-subdued" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-subdued" />
        </div>
        <div className="mt-4 flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="h-5 w-5 animate-spin text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="ml-2 text-sm text-body-muted">Running AI pre-review...</span>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert type="info" title="AI Pre-review">
            Click <strong>&ldquo;Run AI Pre-review&rdquo;</strong> to receive an automated
            analysis of your proposal&rsquo;s completeness, strengths, and areas for
            improvement.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!feedback) return null;

  const score = feedback.overallReadiness ?? feedback.score ?? 0;
  const confidence = feedback.confidence ?? 0;
  const scorePercent = score > 10 ? Math.min(score, 100) : Math.min(score * 10, 100);
  const scoreLabel = score > 10 ? `${Math.round(score)}/100` : `${score.toFixed(1)}/10`;

  const readinessLevel = READINESS_LEVELS.find((l) => score >= l.minScore) || READINESS_LEVELS[READINESS_LEVELS.length - 1];

  const strengths = feedback.strengths || [];
  const issues = feedback.issues || feedback.weaknesses || [];
  const suggestions = feedback.suggestedRevisions || feedback.suggestions || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>AI Pre-review</CardTitle>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              Advisory assessment · Not a final decision
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold leading-none text-primary">
              {scoreLabel}
            </div>
            <div className="mt-1 text-xs text-body-muted">
              {readinessLevel?.label}
            </div>
            <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-subdued">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Advisory notice */}
        <Alert type="info" title="Advisory Notice">
          <div className="space-y-1">
            <p>AI pre-reviews assist {'\u2014'} not replace {'\u2014'} human evaluators.</p>
            <p className="text-xs">
              AI cannot approve, reject, or assign supervisors. All decisions are made by authorized humans.
            </p>
          </div>
        </Alert>

        {/* Confidence */}
        {confidence > 0 && (
          <div className="flex items-center gap-2 rounded border border-hairline bg-subdued px-3 py-2">
            <span className="text-xs text-body-muted">AI Confidence:</span>
            <span className="font-mono text-xs font-medium text-ink">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        )}

        {/* Summary */}
        {feedback.summary && (
          <div className="rounded border border-hairline bg-subdued p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Summary</p>
            <p className="mt-1.5 text-xs leading-6 text-ink">{feedback.summary}</p>
          </div>
        )}

        {/* Strengths */}
        <IssueList title="Strengths" tone="success" items={strengths} />

        {/* Issues */}
        {issues.length > 0 && (
          <IssueList title="Issues to Address" tone="warning" items={issues} />
        )}

        {/* Suggested revisions */}
        {suggestions.length > 0 && (
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-info">
              Suggested Revisions
            </h4>
            <ul className="space-y-1.5">
              {suggestions.map((s, idx) => {
                const sectionLabel = s.section || "";
                const instruction = s.instruction || s;
                return (
                  <li
                    key={idx}
                    className="border-l-2 border-l-info bg-info-bg/30 py-1.5 pl-3 pr-2 text-xs leading-5 text-body-muted"
                  >
                    {sectionLabel && (
                      <span className="mr-1 rounded bg-info-bg px-1 py-0.5 font-mono text-[9px] text-info">
                        {sectionLabel}
                      </span>
                    )}
                    {instruction}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Limitations */}
        {feedback.limitations && (
          <div className="rounded border border-hairline bg-subdued p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Limitations</p>
            <p className="mt-1 text-xs leading-5 text-body-muted">{feedback.limitations}</p>
          </div>
        )}

        {/* Human decision notice */}
        <HumanDecisionNotice variant="inline" />
      </CardContent>
    </Card>
  );
}
