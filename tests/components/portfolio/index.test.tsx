import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Portfolio } from "@/components/portfolio";

// Mock child components
vi.mock("@/components/portfolio/personal-info", () => ({
  PersonalInfo: ({ refreshTrigger }: { refreshTrigger: number }) => (
    <div data-testid="personal-info" data-refresh-trigger={refreshTrigger}>
      Personal Info Component
    </div>
  ),
}));

vi.mock("@/components/portfolio/skills", () => ({
  Skills: ({ refreshTrigger }: { refreshTrigger: number }) => (
    <div data-testid="skills" data-refresh-trigger={refreshTrigger}>
      Skills Component
    </div>
  ),
}));

vi.mock("@/components/portfolio/github-integration", () => ({
  GithubIntegration: ({ refreshTrigger }: { refreshTrigger: number }) => (
    <div data-testid="github-integration" data-refresh-trigger={refreshTrigger}>
      GitHub Integration Component
    </div>
  ),
}));

vi.mock("@/components/portfolio/unsaved-changes-banner", () => ({
  UnsavedChangesBanner: ({
    onDiscardChanges,
  }: {
    onDiscardChanges: () => void;
  }) => (
    <div data-testid="unsaved-changes-banner">
      <button onClick={onDiscardChanges} data-testid="discard-changes">
        Discard Changes
      </button>
      Unsaved Changes Banner
    </div>
  ),
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

// Mock cookie persistence
vi.mock("@/lib/cookie-persistence", () => ({
  clearDraftFromCookies: vi.fn(),
  hasChangesComparedToSaved: vi.fn(),
  loadDraftFromCookies: vi.fn(),
}));

// Mock portfolio
vi.mock("@/lib/portfolio", () => ({
  getPortfolioData: vi.fn(),
}));

describe("Portfolio", () => {
  // Helper function to get mocked auth dependencies
  const getMockAuthDependencies = async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const {
      loadDraftFromCookies,
      hasChangesComparedToSaved,
      clearDraftFromCookies,
    } = await vi.importMock("@/lib/cookie-persistence");
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    return {
      mockIsAuthenticated: isAuthenticated as any,
      mockLoadDraftFromCookies: loadDraftFromCookies as any,
      mockHasChangesComparedToSaved: hasChangesComparedToSaved as any,
      mockClearDraftFromCookies: clearDraftFromCookies as any,
      mockGetPortfolioData: getPortfolioData as any,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders all portfolio components", async () => {
    const { mockIsAuthenticated } = await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(false);

    render(<Portfolio />);

    expect(screen.getByTestId("personal-info")).toBeInTheDocument();
    expect(screen.getByTestId("skills")).toBeInTheDocument();
    expect(screen.getByTestId("github-integration")).toBeInTheDocument();
  });

  it("does not show unsaved changes banner when user is not authenticated", async () => {
    const { mockIsAuthenticated, mockClearDraftFromCookies } =
      await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(false);

    render(<Portfolio />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("unsaved-changes-banner"),
      ).not.toBeInTheDocument();
      expect(mockClearDraftFromCookies).toHaveBeenCalled();
    });
  });

  it("does not show unsaved changes banner when authenticated but no draft exists", async () => {
    const { mockIsAuthenticated, mockLoadDraftFromCookies } =
      await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(null);

    render(<Portfolio />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("unsaved-changes-banner"),
      ).not.toBeInTheDocument();
    });
  });

  it("shows unsaved changes banner when authenticated with draft and no saved data", async () => {
    const {
      mockIsAuthenticated,
      mockLoadDraftFromCookies,
      mockGetPortfolioData,
    } = await getMockAuthDependencies();
    const draftData = { name: "Draft User", title: "Draft Title" };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockResolvedValue(null);

    render(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByTestId("unsaved-changes-banner")).toBeInTheDocument();
    });
  });

  it("shows unsaved changes banner when draft differs from saved data", async () => {
    const {
      mockIsAuthenticated,
      mockLoadDraftFromCookies,
      mockHasChangesComparedToSaved,
      mockGetPortfolioData,
    } = await getMockAuthDependencies();

    const draftData = { name: "Draft User", title: "Draft Title" };
    const savedData = { name: "Saved User", title: "Saved Title" };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockResolvedValue(savedData);
    mockHasChangesComparedToSaved.mockReturnValue(true);

    render(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByTestId("unsaved-changes-banner")).toBeInTheDocument();
      expect(mockHasChangesComparedToSaved).toHaveBeenCalledWith(
        draftData,
        savedData,
      );
    });
  });

  it("does not show unsaved changes banner when draft matches saved data", async () => {
    const {
      mockIsAuthenticated,
      mockLoadDraftFromCookies,
      mockHasChangesComparedToSaved,
      mockGetPortfolioData,
    } = await getMockAuthDependencies();

    const draftData = { name: "Same User", title: "Same Title" };
    const savedData = { name: "Same User", title: "Same Title" };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockResolvedValue(savedData);
    mockHasChangesComparedToSaved.mockReturnValue(false);

    render(<Portfolio />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("unsaved-changes-banner"),
      ).not.toBeInTheDocument();
      expect(mockHasChangesComparedToSaved).toHaveBeenCalledWith(
        draftData,
        savedData,
      );
    });
  });

  it("shows unsaved changes banner when getPortfolioData throws an error", async () => {
    const {
      mockIsAuthenticated,
      mockLoadDraftFromCookies,
      mockGetPortfolioData,
    } = await getMockAuthDependencies();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const draftData = { name: "Draft User", title: "Draft Title" };
    const error = new Error("Network error");

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockRejectedValue(error);

    render(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByTestId("unsaved-changes-banner")).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error checking for unsaved changes:",
        error,
      );
    });

    consoleSpy.mockRestore();
  });

  it("hides unsaved changes banner and increments refresh trigger when discard is clicked", async () => {
    const {
      mockIsAuthenticated,
      mockLoadDraftFromCookies,
      mockHasChangesComparedToSaved,
      mockGetPortfolioData,
    } = await getMockAuthDependencies();

    const draftData = { name: "Draft User", title: "Draft Title" };
    const savedData = { name: "Saved User", title: "Saved Title" };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockResolvedValue(savedData);
    mockHasChangesComparedToSaved.mockReturnValue(true);

    render(<Portfolio />);

    // Wait for banner to appear
    await waitFor(() => {
      expect(screen.getByTestId("unsaved-changes-banner")).toBeInTheDocument();
    });

    // Check initial refresh trigger
    expect(screen.getByTestId("personal-info")).toHaveAttribute(
      "data-refresh-trigger",
      "0",
    );

    // Click discard
    const discardButton = screen.getByTestId("discard-changes");
    discardButton.click();

    // Banner should be hidden and refresh trigger should increment
    await waitFor(() => {
      expect(
        screen.queryByTestId("unsaved-changes-banner"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("personal-info")).toHaveAttribute(
        "data-refresh-trigger",
        "1",
      );
    });
  });

  it("passes refresh trigger to all child components", async () => {
    const { mockIsAuthenticated } = await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(false);

    render(<Portfolio />);

    expect(screen.getByTestId("personal-info")).toHaveAttribute(
      "data-refresh-trigger",
      "0",
    );
    expect(screen.getByTestId("skills")).toHaveAttribute(
      "data-refresh-trigger",
      "0",
    );
    expect(screen.getByTestId("github-integration")).toHaveAttribute(
      "data-refresh-trigger",
      "0",
    );
  });

  it("renders components in correct grid layout", async () => {
    const { mockIsAuthenticated } = await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(false);

    render(<Portfolio />);

    const container = screen
      .getByTestId("personal-info")
      .closest(".ml\\:col-span-2");
    expect(container).toBeInTheDocument();

    const gridContainer = screen.getByTestId("personal-info").closest(".grid");
    expect(gridContainer).toHaveClass("grid-cols-1", "ml:grid-cols-2", "gap-6");
  });

  it("handles authentication state correctly in useEffect", async () => {
    const { mockIsAuthenticated, mockLoadDraftFromCookies } =
      await getMockAuthDependencies();

    // Test that authentication functions are called during component lifecycle
    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue({ name: "User" });

    render(<Portfolio />);

    // Wait for the effect to run
    await waitFor(() => {
      expect(mockIsAuthenticated).toHaveBeenCalled();
      expect(mockLoadDraftFromCookies).toHaveBeenCalled();
    });
  });

  it("applies correct CSS classes to main container", async () => {
    const { mockIsAuthenticated } = await getMockAuthDependencies();
    mockIsAuthenticated.mockReturnValue(false);

    render(<Portfolio />);

    const mainContainer = screen
      .getByTestId("personal-info")
      .closest(".space-y-6");
    expect(mainContainer).toBeInTheDocument();
  });
});
