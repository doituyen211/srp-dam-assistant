import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    login: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/login",
}));

describe("LoginPage", () => {
  it("renders sign in form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in to Research Office")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("you@university.edu")).toBeInTheDocument();
  });

  it("renders register link", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Create student account/i)).toBeInTheDocument();
  });
});
