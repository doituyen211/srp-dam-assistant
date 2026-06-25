import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";

describe("AdminKpiCard", () => {
  it("renders label and value", () => {
    render(<AdminKpiCard label="Total Proposals" value="42" />);
    expect(screen.getByText("Total Proposals")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<AdminKpiCard label="Test" value="1" subtitle="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
