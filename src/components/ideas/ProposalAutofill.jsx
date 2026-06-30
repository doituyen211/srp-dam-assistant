"use client";

import { FIELDS_OF_STUDY } from "@/lib/constants";

/**
 * ProposalAutofill - Right column: editable form that auto-fills from AI cards
 * Student edits manually, never auto-submits
 */
export function ProposalAutofill({ data, onUpdate, onCreate, loading }) {
  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const hasContent = data?.title?.trim() || data?.abstract?.trim() || data?.problem?.trim();

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-hairline bg-canvas">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Proposal Autofill</h2>
          <p className="text-[11px] text-muted">Click AI suggestions to fill fields</p>
        </div>
        {hasContent && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Auto-filled
          </span>
        )}
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5">
        <FieldGroup label="Title" required>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Research proposal title"
            className="w-full rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Research Field">
          <select
            value={data.researchField || ""}
            onChange={(e) => handleChange("researchField", e.target.value)}
            className="w-full rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          >
            <option value="">Select a field</option>
            {FIELDS_OF_STUDY.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup label="Keywords">
          <input
            type="text"
            value={data.keywords || ""}
            onChange={(e) => handleChange("keywords", e.target.value)}
            placeholder="e.g. machine learning, healthcare (comma-separated)"
            className="w-full rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Abstract">
          <textarea
            value={data.abstract || ""}
            onChange={(e) => handleChange("abstract", e.target.value)}
            placeholder="Brief summary of your research..."
            rows={3}
            className="w-full resize-none rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Problem Statement">
          <textarea
            value={data.problem || ""}
            onChange={(e) => handleChange("problem", e.target.value)}
            placeholder="Research problem and context..."
            rows={3}
            className="w-full resize-none rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Objectives">
          <textarea
            value={data.objectives || ""}
            onChange={(e) => handleChange("objectives", e.target.value)}
            placeholder="Research objectives..."
            rows={2}
            className="w-full resize-none rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Methodology">
          <textarea
            value={data.methodology || ""}
            onChange={(e) => handleChange("methodology", e.target.value)}
            placeholder="Research methodology..."
            rows={2}
            className="w-full resize-none rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Timeline">
          <input
            type="text"
            value={data.timeline || ""}
            onChange={(e) => handleChange("timeline", e.target.value)}
            placeholder="e.g. 6 months (Jul - Dec 2026)"
            className="w-full rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>

        <FieldGroup label="Expected Outcome">
          <textarea
            value={data.outcome || ""}
            onChange={(e) => handleChange("outcome", e.target.value)}
            placeholder="Expected results and contributions..."
            rows={2}
            className="w-full resize-none rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </FieldGroup>
      </div>

      {/* Create button */}
      <div className="border-t border-hairline bg-canvas px-5 py-4">
        <button
          type="button"
          onClick={onCreate}
          disabled={loading || !data.title?.trim()}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            loading || !data.title?.trim()
              ? "cursor-not-allowed bg-subdued text-muted"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {loading ? "Creating..." : "Create Proposal"}
        </button>
      </div>
    </div>
  );
}

function FieldGroup({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}
