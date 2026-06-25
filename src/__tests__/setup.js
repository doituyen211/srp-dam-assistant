import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  useParams: () => ({}),
}));

// Mock next/link — using createElement to avoid JSX parsing issues
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children),
}));

afterEach(cleanup);
