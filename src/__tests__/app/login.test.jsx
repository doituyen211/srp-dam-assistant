import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";

describe("LoginPage", () => {
  it("renders sign in form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Đăng nhập vào Research Office")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("you@university.edu")).toBeInTheDocument();
  });

  it("renders register link", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Tạo tài khoản sinh viên/i)).toBeInTheDocument();
  });
});
