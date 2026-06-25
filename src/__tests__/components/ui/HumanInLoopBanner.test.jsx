import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";

describe("HumanInLoopBanner", () => {
  it("renders default banner with advisory message", () => {
    render(<HumanInLoopBanner />);
    expect(screen.getByText(/Human-in-the-loop/i)).toBeInTheDocument();
    expect(screen.getByText(/AI provides advisory/i)).toBeInTheDocument();
  });

  it("renders inline variant", () => {
    render(<HumanInLoopBanner variant="inline" />);
    expect(screen.getByText(/AI advisory only/i)).toBeInTheDocument();
  });

  it("renders badge variant", () => {
    render(<HumanInLoopBanner variant="badge" />);
    expect(screen.getByText(/Human decides/i)).toBeInTheDocument();
  });
});
