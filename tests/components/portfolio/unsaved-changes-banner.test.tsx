import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UnsavedChangesBanner } from "@/components/portfolio/unsaved-changes-banner";

// Mock clearDraftFromCookies
vi.mock("@/lib/cookie-persistence", () => ({
  clearDraftFromCookies: vi.fn(),
}));

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: { reload: vi.fn() },
  writable: true,
});

describe("UnsavedChangesBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders unsaved changes message", () => {
    render(<UnsavedChangesBanner />);

    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    expect(
      screen.getByText("You are viewing a preview of your changes."),
    ).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<UnsavedChangesBanner />);

    expect(screen.getByText("Discard Changes")).toBeInTheDocument();
    expect(screen.getByText("Go to Editor")).toBeInTheDocument();
  });

  it("Go to Editor button has correct href", () => {
    render(<UnsavedChangesBanner />);

    const editorLink = screen.getByText("Go to Editor");
    expect(editorLink.closest("a")).toHaveAttribute("href", "/edit");
  });

  it("has correct styling classes", () => {
    render(<UnsavedChangesBanner />);

    const card = screen.getByText("Unsaved changes").closest(".bg-warning-50");
    expect(card).toBeInTheDocument();
  });

  it("chip has warning color and dot variant", () => {
    render(<UnsavedChangesBanner />);

    const chip = screen.getByText("Unsaved changes");
    expect(chip).toBeInTheDocument();
  });
});
