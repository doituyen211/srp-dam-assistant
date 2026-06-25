import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "@/components/ui/LoadingState";

describe("LoadingState", () => {
  it("renders with default message", () => {
    const { container } = render(<LoadingState />);
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders with custom message", () => {
    render(<LoadingState message="Loading data..." />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });
});
