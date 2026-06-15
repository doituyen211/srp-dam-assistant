"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { HumanDecisionNotice } from "@/components/proposal/HumanDecisionNotice";

/**
 * ReviewDecisionPanel — Decision panel with required comment field
 * The reviewer is explicitly shown as the accountable human decision maker.
 * AI recommendation is visually secondary.
 */
export function ReviewDecisionPanel({
  proposal,
  onDecision,
  loading = false,
}) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleDecision = (decision) => {
    if (!comment.trim()) {
      setError("Please provide a review comment before making a decision.");
      return;
    }
    setError("");
    onDecision?.(decision, comment);
  };

  return (
    <div className="space-y-4">
      {/* Human accountability notice */}
      <HumanDecisionNotice />

      {/* Reviewer comment field */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-ink" htmlFor="review-comment">
          Reviewer Comment <span className="text-danger">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (error) setError("");
          }}
          placeholder="Provide your rationale for this decision. Reference specific rubric criteria or sections..."
          rows={4}
          className="min-h-[100px] w-full resize-y rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        />
        <div className="flex justify-between text-xs">
          <span className="text-body-muted">
            Your comment will be visible to the student and administrator.
          </span>
          <span className="text-muted">{comment.length} characters</span>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Decision buttons — reviewer is the accountable human */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="secondary"
          className="border-warning/40 text-warning hover:bg-warning hover:text-white"
          loading={loading}
          disabled={loading}
          onClick={() => handleDecision("needs_revision")}
        >
          Request Revision
        </Button>
        <Button
          variant="primary"
          loading={loading}
          disabled={loading}
          onClick={() => handleDecision("approved")}
        >
          Recommend Approval
        </Button>
        <Button
          variant="danger"
          loading={loading}
          disabled={loading}
          onClick={() => handleDecision("rejected")}
        >
          Reject
        </Button>
      </div>

      <p className="text-xs text-body-muted">
        As the reviewer, your decision is final for this stage and will be
        recorded in the proposal audit trail.
      </p>
    </div>
  );
}
