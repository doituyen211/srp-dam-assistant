"use client";

import { ProposalForm } from "@/components/proposal/ProposalForm";

/**
 * ProposalBuilder - Right column that wraps ProposalForm
 * Used in the Idea-to-Proposal flow for auto-fill from AI cards
 */
export function ProposalBuilder({ proposalData, onUpdate, onCreate, loading, isReadOnly }) {
  const hasContent = proposalData?.title?.trim() || proposalData?.abstract?.trim() || proposalData?.problem?.trim();

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-hairline bg-canvas">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Proposal Builder</h2>
          <p className="text-[11px] text-muted">Click AI suggestions to auto-fill fields</p>
        </div>
        {hasContent && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Auto-filled
          </span>
        )}
      </div>

      {/* Scrollable ProposalForm */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <ProposalForm
            initialData={proposalData}
            onChange={onUpdate}
            onSubmit={(data, mode) => { if (mode === "submit") onCreate(); }}
            loading={loading}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}
