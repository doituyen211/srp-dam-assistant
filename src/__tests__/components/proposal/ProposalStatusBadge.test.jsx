import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";

describe("ProposalStatusBadge", () => {
  it("renders with status label", () => {
    render(<ProposalStatusBadge status="draft" />);
    expect(screen.getByText(/Nháp|draft/i)).toBeInTheDocument();
  });

  it("renders stage info when showWorkflow is true", () => {
    render(<ProposalStatusBadge status="submitted" showWorkflow />);
    expect(screen.getByText(/Stage/i)).toBeInTheDocument();
  });
});
