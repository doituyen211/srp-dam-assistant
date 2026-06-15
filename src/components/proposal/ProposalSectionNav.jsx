"use client";

import { SECTION_TYPES } from "@/lib/constants";
import { SectionHealthBadge } from "./SectionHealthBadge";

/**
 * ProposalSectionNav — Left sidebar section navigation with health status
 */
export function ProposalSectionNav({
  sections = [],
  activeSection,
  onSectionChange,
  className = "",
}) {
  const sectionMap = {};
  sections.forEach((s) => {
    sectionMap[s.id] = s;
  });

  return (
    <nav className={`space-y-1 ${className}`}>
      {SECTION_TYPES.map((sectionDef) => {
        const section = sectionMap[sectionDef.id];
        const isActive = activeSection === sectionDef.id;
        const health = section?.health || "missing";

        return (
          <button
            key={sectionDef.id}
            type="button"
            onClick={() => onSectionChange?.(sectionDef.id)}
            className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-body-muted hover:bg-subdued hover:text-ink"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`truncate ${isActive ? "font-medium" : ""}`}
              >
                {sectionDef.label}
              </span>
              {section && (
                <SectionHealthBadge
                  health={health}
                  className={isActive ? "border-white/20" : ""}
                />
              )}
              {!section && (
                <span className="rounded border border-hairline bg-subdued px-1.5 py-0.5 font-mono text-[9px] text-muted">
                  NEW
                </span>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
