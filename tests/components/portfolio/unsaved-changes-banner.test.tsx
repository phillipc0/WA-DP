import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnsavedChangesBanner } from "@/components/portfolio/unsaved-changes-banner";

// Mock cookie persistence functions
vi.mock("@/lib/cookie-persistence", () => ({
  clearDraftFromCookies: vi.fn(),
  loadDraftFromCookies: vi.fn(),
}));

// Mock portfolio functions
vi.mock("@/lib/portfolio", () => ({
  savePortfolioData: vi.fn(),
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
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("Save Changes button has correct styling", () => {
    render(<UnsavedChangesBanner />);

    const saveButton = screen.getByText("Save Changes");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("type", "button");
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

  it("calls clearDraftFromCookies and reloads page when discard is clicked", async () => {
    const { clearDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );

    const mockClearDraftFromCookies = clearDraftFromCookies as any;

    render(<UnsavedChangesBanner />);

    fireEvent.click(screen.getByText("Discard Changes"));

    expect(mockClearDraftFromCookies).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("calls onDiscardChanges callback when provided after discard", async () => {
    const { clearDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );

    const mockClearDraftFromCookies = clearDraftFromCookies as any;
    const mockOnDiscardChanges = vi.fn();

    render(<UnsavedChangesBanner onDiscardChanges={mockOnDiscardChanges} />);

    fireEvent.click(screen.getByText("Discard Changes"));

    expect(mockClearDraftFromCookies).toHaveBeenCalled();
    expect(mockOnDiscardChanges).toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it("saves changes and reloads page when save is clicked successfully", async () => {
    const { loadDraftFromCookies, clearDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { savePortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockClearDraftFromCookies = clearDraftFromCookies as any;
    const mockSavePortfolioData = savePortfolioData as any;

    const mockData = { name: "Test User" };
    mockLoadDraftFromCookies.mockReturnValue(mockData);
    mockSavePortfolioData.mockResolvedValue(true);

    render(<UnsavedChangesBanner />);

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockLoadDraftFromCookies).toHaveBeenCalled();
      expect(mockSavePortfolioData).toHaveBeenCalledWith(mockData);
      expect(mockClearDraftFromCookies).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it("calls onDiscardChanges callback when save is successful and callback provided", async () => {
    const { loadDraftFromCookies, clearDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { savePortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockClearDraftFromCookies = clearDraftFromCookies as any;
    const mockSavePortfolioData = savePortfolioData as any;
    const mockOnDiscardChanges = vi.fn();

    const mockData = { name: "Test User" };
    mockLoadDraftFromCookies.mockReturnValue(mockData);
    mockSavePortfolioData.mockResolvedValue(true);

    render(<UnsavedChangesBanner onDiscardChanges={mockOnDiscardChanges} />);

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockSavePortfolioData).toHaveBeenCalledWith(mockData);
      expect(mockClearDraftFromCookies).toHaveBeenCalled();
      expect(mockOnDiscardChanges).toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });

  it("does nothing when save is clicked but no draft data exists", async () => {
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { savePortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockSavePortfolioData = savePortfolioData as any;

    mockLoadDraftFromCookies.mockReturnValue(null);

    render(<UnsavedChangesBanner />);

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockLoadDraftFromCookies).toHaveBeenCalled();
      expect(mockSavePortfolioData).not.toHaveBeenCalled();
    });
  });

  it("logs error when save fails", async () => {
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { savePortfolioData } = await vi.importMock("@/lib/portfolio");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockSavePortfolioData = savePortfolioData as any;

    const mockData = { name: "Test User" };
    mockLoadDraftFromCookies.mockReturnValue(mockData);
    mockSavePortfolioData.mockResolvedValue(false);

    render(<UnsavedChangesBanner />);

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockSavePortfolioData).toHaveBeenCalledWith(mockData);
      expect(consoleSpy).toHaveBeenCalledWith("Failed to save portfolio data");
    });

    consoleSpy.mockRestore();
  });

  it("logs error when save throws exception", async () => {
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { savePortfolioData } = await vi.importMock("@/lib/portfolio");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockSavePortfolioData = savePortfolioData as any;

    const mockData = { name: "Test User" };
    const mockError = new Error("Network error");
    mockLoadDraftFromCookies.mockReturnValue(mockData);
    mockSavePortfolioData.mockRejectedValue(mockError);

    render(<UnsavedChangesBanner />);

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockSavePortfolioData).toHaveBeenCalledWith(mockData);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving portfolio data:",
        mockError,
      );
    });

    consoleSpy.mockRestore();
  });
});
