import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card><CardContent><p>Content</p></CardContent></Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies accent class when accent prop is provided", () => {
    const { container } = render(<Card accent="info"><CardContent>Info</CardContent></Card>);
    expect(container.firstChild.className).toContain("border-l-info");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader><h3>Header</h3></CardHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders text", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title")).toBeInTheDocument();
  });
});
