"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

function ScoreBar({ label, score, maxScore = 10 }) {
  const pct = (score / maxScore) * 100;
  const color =
    pct >= 85 ? "bg-success" : pct >= 65 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-body-muted">{label}</span>
      <div className="flex-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-subdued">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-right font-mono text-xs font-medium text-ink">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

/**
 * LecturerMatchCard — Enhanced with score breakdown, capacity warning, admin actions
 */
export function LecturerMatchCard({
  lecturer,
  onAssign,
  onShortlist,
  onReject,
  loading = false,
  canAdmin = false,
  isLecturerView = false,
  onAcceptInterest,
  onDeclineInterest,
}) {
  const loadPct = Math.round(
    (lecturer.currentLoad / lecturer.maxLoad) * 100,
  );
  const loadStatus =
    loadPct >= 100
      ? { label: "Full capacity", color: "text-danger bg-danger-bg border-danger/30" }
      : loadPct >= 75
        ? { label: "Near capacity", color: "text-warning bg-warning-bg border-warning/30" }
        : { label: "Available", color: "text-success bg-success-bg border-success/30" };

  const breakdown = lecturer.scoreBreakdown || {};
  const hasBreakdown =
    breakdown.topicSimilarity != null ||
    breakdown.expertiseFit != null ||
    breakdown.capacityAvailability != null ||
    breakdown.priorSupervision != null;

  const matchScore = lecturer.matchScore || 0;
  const scoreColor =
    matchScore >= 8
      ? "text-success"
      : matchScore >= 6.5
        ? "text-warning"
        : "text-danger";
  const scoreBg =
    matchScore >= 8
      ? "bg-success-bg"
      : matchScore >= 6.5
        ? "bg-warning-bg"
        : "bg-danger-bg";

  return (
    <Card className="flex h-full flex-col transition-all duration-150 hover:shadow-card-hover">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        {/* Header: name, title, match score */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-ink">
              {lecturer.name}
            </h3>
            {lecturer.title && (
              <p className="mt-0.5 text-xs font-medium text-body-muted">
                {lecturer.title}
              </p>
            )}
            <p className="text-xs text-body-muted">{lecturer.department}</p>
          </div>
          <div
            className={`flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full ${scoreBg}`}
          >
            <span className={`text-base font-semibold leading-none ${scoreColor}`}>
              {matchScore.toFixed(1)}
            </span>
            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-muted">
              Match
            </span>
          </div>
        </div>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-1.5">
          {lecturer.expertise?.map((skill) => (
            <Badge key={skill} intent="default" className="border-hairline bg-subdued text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Active projects */}
        {lecturer.activeProjects?.length > 0 && (
          <div className="rounded border border-hairline bg-subdued/30 px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
              Active Projects
            </p>
            <ul className="mt-1 space-y-0.5">
              {lecturer.activeProjects.map((proj, i) => (
                <li key={i} className="text-xs text-body-muted">
                  • {proj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Capacity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
              Supervision Load
            </span>
            <span
              className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium ${loadStatus.color}`}
            >
              {lecturer.currentLoad}/{lecturer.maxLoad} · {loadStatus.label}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-subdued">
            <div
              className={`h-full rounded-full transition-all ${
                loadPct >= 100
                  ? "bg-danger"
                  : loadPct >= 75
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${Math.min(loadPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Score breakdown */}
        {hasBreakdown && (
          <div className="space-y-2 rounded border border-hairline bg-subdued/30 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
              Match Explanation
            </p>
            <div className="space-y-1.5">
              {breakdown.topicSimilarity != null && (
                <ScoreBar
                  label="Topic similarity"
                  score={breakdown.topicSimilarity}
                />
              )}
              {breakdown.expertiseFit != null && (
                <ScoreBar
                  label="Expertise fit"
                  score={breakdown.expertiseFit}
                />
              )}
              {breakdown.capacityAvailability != null && (
                <ScoreBar
                  label="Capacity"
                  score={breakdown.capacityAvailability}
                />
              )}
              {breakdown.priorSupervision != null && (
                <ScoreBar
                  label="Prior supervision"
                  score={breakdown.priorSupervision}
                />
              )}
            </div>
          </div>
        )}

        {/* Match reasons */}
        {lecturer.matchReasons?.length > 0 && (
          <div className="rounded border border-info/20 bg-info-bg/30 px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-info">
              Why this match?
            </p>
            <ul className="mt-1 space-y-0.5">
              {lecturer.matchReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-body-muted">
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-info" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk note */}
        {lecturer.risks?.map((risk) => (
          <div
            key={risk.type}
            className="rounded border border-danger/20 bg-danger-bg px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-danger">
                {risk.severity === "high" ? "High risk" : "Warning"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-danger/90">{risk.label}</p>
          </div>
        ))}
        {lecturer.riskNote && !lecturer.risks && (
          <div className="rounded border border-warning/20 bg-warning-bg px-3 py-2">
            <p className="text-xs text-warning/90">{lecturer.riskNote}</p>
          </div>
        )}

        {/* Admin actions */}
        {canAdmin && (
          <div className="mt-auto flex gap-2">
            <Button
              variant="primary"
              className="flex-1 text-xs"
              loading={loading}
              disabled={loading}
              onClick={() => onAssign?.(lecturer.id)}
            >
              Assign
            </Button>
            <Button
              variant="secondary"
              className="flex-1 text-xs"
              onClick={() => onShortlist?.(lecturer.id)}
              disabled={loading}
            >
              Shortlist
            </Button>
            <Button
              variant="ghost"
              className="flex-shrink-0 text-xs text-danger"
              onClick={() => onReject?.(lecturer.id)}
              disabled={loading}
            >
              Reject
            </Button>
          </div>
        )}

        {/* Lecturer view actions */}
        {isLecturerView && (
          <div className="mt-auto flex gap-2">
            <Button
              variant="primary"
              className="flex-1 text-xs"
              loading={loading}
              disabled={loading}
              onClick={() => onAcceptInterest?.(lecturer.id)}
            >
              Accept Interest
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-xs text-body-muted"
              onClick={() => onDeclineInterest?.(lecturer.id)}
              disabled={loading}
            >
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
