import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies status-based styling when status prop is provided", () => {
    const { container } = render(<Badge status="approved">Done</Badge>);
    expect(container.firstChild.className).toContain("border");
  });
});
