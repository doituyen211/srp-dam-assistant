import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHealthBadge } from "@/components/proposal/SectionHealthBadge";

describe("SectionHealthBadge", () => {
  it("renders with strong health", () => {
    render(<SectionHealthBadge health="strong" />);
    expect(screen.getByText(/Tốt|strong/i)).toBeInTheDocument();
  });
});
