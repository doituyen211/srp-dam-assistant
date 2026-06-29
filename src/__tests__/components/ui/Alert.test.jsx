import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "@/components/ui/Alert";

describe("Alert", () => {
  it("renders children", () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Alert title="Warning">Content</Alert>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("shows close button when closable", () => {
    render(<Alert closable>Closable</Alert>);
    expect(screen.getByLabelText("Close notification")).toBeInTheDocument();
  });

  it("disappears after close button click", async () => {
    const user = userEvent.setup();
    render(<Alert closable>Will Close</Alert>);
    await user.click(screen.getByLabelText("Close notification"));
    expect(screen.queryByText("Will Close")).not.toBeInTheDocument();
  });
});
