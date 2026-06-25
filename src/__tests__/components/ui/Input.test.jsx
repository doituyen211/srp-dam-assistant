import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders label when provided", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows error message when error prop is set", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("shows helper text when helperText prop is set", () => {
    render(<Input label="Email" helperText="Enter your email" />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input label="Email" error="Error" helperText="Helper" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });
});
