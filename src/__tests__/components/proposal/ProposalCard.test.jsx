import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProposalCard } from "@/components/proposal/ProposalCard";
import { mockProposals } from "@/__tests__/fixtures/proposals";

describe("ProposalCard", () => {
  it("renders proposal title", () => {
    render(<ProposalCard proposal={mockProposals[0]} />);
    expect(screen.getByText("Test Proposal 1")).toBeInTheDocument();
  });

  it("renders research field tag", () => {
    render(<ProposalCard proposal={mockProposals[0]} />);
    expect(screen.getByText("Trí tuệ nhân tạo")).toBeInTheDocument();
  });

  it("renders readiness score when present", () => {
    const { container } = render(<ProposalCard proposal={mockProposals[0]} />);
    expect(container.textContent).toContain("8");
  });
});
