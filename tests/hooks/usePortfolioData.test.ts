import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// Mock dependencies
vi.mock("@/config/site", () => ({
  siteConfig: {
    portfolio: {
      name: "Default Name",
      title: "Default Title",
      bio: "Default bio",
    },
  },
}));

vi.mock("@/lib/portfolio", () => ({
  getPortfolioData: vi.fn(),
}));

vi.mock("@/lib/cookie-persistence", () => ({
  loadDraftFromCookies: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

describe("usePortfolioData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns default portfolio data and loading state initially", () => {
    const { result } = renderHook(() => usePortfolioData());

    expect(result.current.portfolioData).toEqual({
      name: "Default Name",
      title: "Default Title",
      bio: "Default bio",
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("loads draft data when user is authenticated and draft exists", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const draftData = {
      name: "Draft Name",
      title: "Draft Title",
      bio: "Draft bio",
    };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(draftData);
    expect(mockGetPortfolioData).not.toHaveBeenCalled();
  });

  it("loads portfolio data when user is authenticated but no draft exists", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const serverData = {
      name: "Server Name",
      title: "Server Title",
      bio: "Server bio",
    };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(null);
    mockGetPortfolioData.mockResolvedValue(serverData);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(serverData);
    expect(mockGetPortfolioData).toHaveBeenCalled();
  });

  it("loads portfolio data when user is not authenticated", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const serverData = {
      name: "Public Name",
      title: "Public Title",
      bio: "Public bio",
    };

    mockIsAuthenticated.mockReturnValue(false);
    mockGetPortfolioData.mockResolvedValue(serverData);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(serverData);
    expect(mockLoadDraftFromCookies).not.toHaveBeenCalled();
    expect(mockGetPortfolioData).toHaveBeenCalled();
  });

  it("keeps default data when getPortfolioData returns null", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockGetPortfolioData = getPortfolioData as any;

    mockIsAuthenticated.mockReturnValue(false);
    mockGetPortfolioData.mockResolvedValue(null);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual({
      name: "Default Name",
      title: "Default Title",
      bio: "Default bio",
    });
  });

  it("handles errors during data loading", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mockIsAuthenticated = isAuthenticated as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const error = new Error("Network error");
    mockIsAuthenticated.mockReturnValue(false);
    mockGetPortfolioData.mockRejectedValue(error);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual({
      name: "Default Name",
      title: "Default Title",
      bio: "Default bio",
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading portfolio data:",
      error,
    );

    consoleSpy.mockRestore();
  });

  it("reloads data when refreshTrigger changes", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const firstData = {
      name: "First Name",
      title: "First Title",
      bio: "First bio",
    };

    const secondData = {
      name: "Second Name",
      title: "Second Title",
      bio: "Second bio",
    };

    mockIsAuthenticated.mockReturnValue(false);
    mockGetPortfolioData.mockResolvedValueOnce(firstData);

    const { result, rerender } = renderHook(
      ({ trigger }) => usePortfolioData(trigger),
      { initialProps: { trigger: 1 } },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(firstData);
    expect(mockGetPortfolioData).toHaveBeenCalledTimes(1);

    // Change the trigger
    mockGetPortfolioData.mockResolvedValueOnce(secondData);
    rerender({ trigger: 2 });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(secondData);
    expect(mockGetPortfolioData).toHaveBeenCalledTimes(2);
  });

  it("handles authentication state changes with draft data priority", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const draftData = {
      name: "Draft Name",
      title: "Draft Title",
      bio: "Draft bio",
    };

    const serverData = {
      name: "Server Name",
      title: "Server Title",
      bio: "Server bio",
    };

    // Initially authenticated with draft
    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockResolvedValue(serverData);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should load draft data, not server data
    expect(result.current.portfolioData).toEqual(draftData);
    expect(mockGetPortfolioData).not.toHaveBeenCalled();
  });

  it("sets loading to true during data fetch and false when complete", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockGetPortfolioData = getPortfolioData as any;

    mockIsAuthenticated.mockReturnValue(false);

    // Create a promise that we can control
    let resolvePromise!: (value: any) => void;
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockGetPortfolioData.mockReturnValue(controlledPromise);

    const { result } = renderHook(() => usePortfolioData());

    // Initially loading should be true
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    resolvePromise({ name: "Test", title: "Test", bio: "Test" });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("prioritizes draft data over server data when both exist", async () => {
    const { isAuthenticated } = await vi.importMock("@/lib/auth");
    const { loadDraftFromCookies } = await vi.importMock(
      "@/lib/cookie-persistence",
    );
    const { getPortfolioData } = await vi.importMock("@/lib/portfolio");

    const mockIsAuthenticated = isAuthenticated as any;
    const mockLoadDraftFromCookies = loadDraftFromCookies as any;
    const mockGetPortfolioData = getPortfolioData as any;

    const draftData = { name: "Draft", title: "Draft Title", bio: "Draft bio" };
    const serverData = {
      name: "Server",
      title: "Server Title",
      bio: "Server bio",
    };

    mockIsAuthenticated.mockReturnValue(true);
    mockLoadDraftFromCookies.mockReturnValue(draftData);
    mockGetPortfolioData.mockResolvedValue(serverData);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(draftData);
    // getPortfolioData should not be called when draft exists
    expect(mockGetPortfolioData).not.toHaveBeenCalled();
  });
});
