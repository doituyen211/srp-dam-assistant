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
    success: "text-green-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  };

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        {/* Name & Score */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">{lecturer.name}</h3>
            <p className="text-sm text-slate-600">{lecturer.department}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {lecturer.matchScore.toFixed(1)}
            </div>
            <p className="text-xs text-slate-500">Match score</p>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1">
          {lecturer.expertise.map((skill) => (
            <Badge key={skill} intent="info" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Capacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-700">
              Công việc hiện tại
            </span>
            <span className={`font-semibold ${capacityColors[capacityStatus]}`}>
              {lecturer.currentLoad}/{lecturer.maxLoad}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                capacityStatus === "danger"
                  ? "bg-red-500"
                  : capacityStatus === "warning"
                    ? "bg-amber-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Reason */}
        <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">{lecturer.reason}</p>
        </div>

        {/* Risk Note */}
        {lecturer.riskNote && (
          <div className="bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-800">{lecturer.riskNote}</p>
          </div>
        )}

        {/* Recommend Button */}
        <Button
          variant="primary"
          onClick={() => onRecommend?.(lecturer.id)}
          loading={loading}
          disabled={loading || !canRecommend}
          className="w-full"
        >
          {canRecommend ? buttonLabel : "Chỉ có quyền xem"}
        </Button>
      </CardContent>
    </Card>
  );
}
