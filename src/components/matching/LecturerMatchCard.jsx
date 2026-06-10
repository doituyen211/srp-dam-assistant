"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

/**
 * LecturerMatchCard - Display lecturer matching suggestion
 * @param {Object} props
 * @param {Object} props.lecturer - Lecturer object with name, department, expertise, etc.
 * @param {Function} props.onRecommend - Called when recommend button clicked
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.canRecommend - Whether recommend action is enabled
 * @param {string} props.buttonLabel - Recommend button label
 */
export function LecturerMatchCard({
  lecturer,
  onRecommend,
  loading = false,
  canRecommend = true,
  buttonLabel = "Recommend this lecturer",
}) {
  const capacityPercentage = Math.round(
    (lecturer.currentLoad / lecturer.maxLoad) * 100,
  );
  const capacityStatus =
    capacityPercentage >= 100
      ? "danger"
      : capacityPercentage >= 75
        ? "warning"
        : "success";

  const capacityColors = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-error",
  };

  const capacityBars = {
    success: "bg-deep-green",
    warning: "bg-warning",
    danger: "bg-error",
  };

  return (
    <Card className="h-full transition-all duration-150 hover:border-[#aaa] hover:shadow-card">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-medium text-ink">
              {lecturer.name}
            </h3>
            <p className="mt-1 text-sm text-body-muted">{lecturer.department}</p>
          </div>
          <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full bg-pale-green text-center text-deep-green">
            <div className="text-base font-semibold leading-none">
              {lecturer.matchScore.toFixed(1)}
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em]">
              Match
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {lecturer.expertise.map((skill) => (
            <Badge key={skill} intent="info">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-mono uppercase tracking-[0.08em] text-muted">
              Capacity
            </span>
            <span className={`font-semibold ${capacityColors[capacityStatus]}`}>
              {lecturer.currentLoad}/{lecturer.maxLoad}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-soft-stone">
            <div
              className={`h-full rounded-full transition-all ${capacityBars[capacityStatus]}`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-[#fafafa] px-3 py-2">
          <p className="text-xs leading-5 text-body-muted">{lecturer.reason}</p>
        </div>

        {lecturer.riskNote && (
          <div className="rounded-lg border border-[#ffe082] bg-[#fff8e1] px-3 py-2">
            <p className="text-xs leading-5 text-[#5d4037]">
              {lecturer.riskNote}
            </p>
          </div>
        )}

        <Button
          variant="primary"
          onClick={() => onRecommend?.(lecturer.id)}
          loading={loading}
          disabled={loading || !canRecommend}
          className="mt-auto w-full"
        >
          {canRecommend ? buttonLabel : "Chỉ có quyền xem"}
        </Button>
      </CardContent>
    </Card>
  );
}
