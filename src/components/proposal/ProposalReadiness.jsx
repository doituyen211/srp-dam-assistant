"use client";

import { useMemo } from "react";
import { SECTION_TYPES } from "@/lib/constants";

/**
 * ProposalReadiness - Progress bar showing proposal completion status
 * Computes readiness from section health statuses
 */
export function ProposalReadiness({ proposal, onSubmit, loading }) {
  const sections = useMemo(() => proposal?.sections || [], [proposal]);

  const readiness = useMemo(() => {
    const total = SECTION_TYPES.length;
    const completed = sections.filter((s) => s.health === "strong").length;
    const needsWork = sections.filter((s) => s.health === "needs_evidence").length;
    const weak = sections.filter((s) => s.health === "weak").length;
    const missing = sections.filter((s) => s.health === "missing" || !s.content).length;

    // Weighted score: strong=1, needs_evidence=0.6, weak=0.3, missing=0
    const score = sections.reduce((acc, s) => {
      if (s.health === "strong") return acc + 1;
      if (s.health === "needs_evidence") return acc + 0.6;
      if (s.health === "weak") return acc + 0.3;
      return acc;
    }, 0);

    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    return { total, completed, needsWork, weak, missing, percent };
  }, [sections]);

  const getSectionStatus = (sectionDef) => {
    const section = sections.find((s) => s.id === sectionDef.id);
    if (!section || !section.content) return "missing";
    return section.health || "missing";
  };

  const statusIcons = {
    strong: { icon: "✓", color: "text-success" },
    needs_evidence: { icon: "⚠", color: "text-warning" },
    weak: { icon: "⚠", color: "text-warning" },
    missing: { icon: "✗", color: "text-danger" },
  };

  const getProgressBarColor = (percent) => {
    if (percent >= 80) return "bg-success";
    if (percent >= 50) return "bg-warning";
    return "bg-danger";
  };

  const isReady = readiness.percent >= 80;

  return (
    <div className="rounded border border-hairline bg-canvas p-5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Proposal Readiness</h3>
          <span className="font-mono text-lg font-semibold text-ink">{readiness.percent}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-subdued">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(readiness.percent)}`}
            style={{ width: `${readiness.percent}%` }}
          />
        </div>

        {/* Section checklist */}
        <div className="space-y-1.5">
          {SECTION_TYPES.map((sectionDef) => {
            const status = getSectionStatus(sectionDef);
            const { icon, color } = statusIcons[status] || statusIcons.missing;
            return (
              <div key={sectionDef.id} className="flex items-center gap-2 text-xs">
                <span className={`w-4 text-center font-medium ${color}`}>{icon}</span>
                <span className={status === "strong" ? "text-ink" : "text-body-muted"}>
                  {sectionDef.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-xs text-body-muted">
          <span>{readiness.completed} completed</span>
          <span>{readiness.needsWork} needs work</span>
          <span>{readiness.missing} not written</span>
        </div>

        {/* Submit button */}
        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !isReady}
            className={`w-full rounded px-4 py-2.5 text-sm font-medium transition-colors ${
              isReady
                ? "bg-primary text-white hover:bg-primary/90"
                : "cursor-not-allowed bg-subdued text-muted"
            }`}
          >
            {loading ? "Submitting..." : isReady ? "Submit proposal" : "Complete at least 80% to submit"}
          </button>
        )}
      </div>
    </div>
  );
}
