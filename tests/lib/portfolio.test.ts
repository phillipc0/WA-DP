import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio";

// Mock authenticatedFetch
vi.mock("@/lib/auth", () => ({
  authenticatedFetch: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("portfolio", () => {
  const mockPortfolioData = {
    name: "John Doe",
    title: "Developer",
    bio: "A skilled developer",
    location: "New York",
    email: "john@example.com",
    avatar: "avatar.jpg",
    social: {
      github: "johndoe",
      twitter: "johndoe",
      linkedin: "johndoe",
      discord: "johndoe#1234",
      reddit: "johndoe",
    },
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 85 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("getPortfolioData", () => {
    it("returns portfolio data on successful fetch", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockPortfolioData)),
      } as any);

      const result = await getPortfolioData();

      expect(result).toEqual(mockPortfolioData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/portfolio.json?_t="),
        {
          method: "GET",
        },
      );
    });

    it("returns null and logs error when fetch fails", async () => {
      const mockFetch = vi.mocked(fetch);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
        text: vi.fn().mockResolvedValue(null),
      } as any);

      const result = await getPortfolioData();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch portfolio data:",
        "Not Found",
      );

      consoleSpy.mockRestore();
    });

    it("returns null and logs error when fetch throws exception", async () => {
      const mockFetch = vi.mocked(fetch);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const networkError = new Error("Network error");

      mockFetch.mockRejectedValueOnce(networkError);

      const result = await getPortfolioData();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching portfolio data:",
        networkError,
      );

      consoleSpy.mockRestore();
    });
  });

  describe("savePortfolioData", () => {
    it("returns true on successful save", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const mockAuthenticatedFetch = authenticatedFetch as any;

      mockAuthenticatedFetch.mockResolvedValueOnce({
        ok: true,
      } as any);

      const result = await savePortfolioData(mockPortfolioData as any);

      expect(result).toBe(true);
      expect(mockAuthenticatedFetch).toHaveBeenCalledWith("/api/portfolio", {
        method: "POST",
        body: JSON.stringify(mockPortfolioData),
      });
    });

    it("returns false and logs error when save fails with error response", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const mockAuthenticatedFetch = authenticatedFetch as any;
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const errorResponse = { error: "Validation failed" };
      mockAuthenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue(errorResponse),
      } as any);

      const result = await savePortfolioData(mockPortfolioData as any);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save portfolio data:",
        "Validation failed",
      );

      consoleSpy.mockRestore();
    });

    it("returns false and logs error when save fails without readable error", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const mockAuthenticatedFetch = authenticatedFetch as any;
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockAuthenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockRejectedValue(new Error("JSON parse error")),
      } as any);

      const result = await savePortfolioData(mockPortfolioData as any);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save portfolio data:",
        "Unknown error",
      );

      consoleSpy.mockRestore();
    });

    it("returns false and logs error when authenticatedFetch throws exception", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const mockAuthenticatedFetch = authenticatedFetch as any;
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const networkError = new Error("Network error");

      mockAuthenticatedFetch.mockRejectedValueOnce(networkError);

      const result = await savePortfolioData(mockPortfolioData as any);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving portfolio data:",
        networkError,
      );

      consoleSpy.mockRestore();
    });

    it("returns null if portfolio.json not available", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi
          .fn()
          .mockResolvedValue("<!doctype html> <html lang='en'></html>"),
      } as any);

      const result = await getPortfolioData();

      expect(result).toEqual(null);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/portfolio.json?_t="),
        {
          method: "GET",
        },
      );
    });

    it("uses cache busting to prevent stale data", async () => {
      const mockFetch = vi.mocked(fetch);

      // Mock first call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify({ data: "first" })),
      } as any);

      // First call
      const result1 = await getPortfolioData();
      expect(result1).toEqual({ data: "first" });

      // Verify cache busting URL was used
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/portfolio\.json\?_t=\d+/),
        {
          method: "GET",
        },
      );

      // Mock second call for when cache is cleared
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(JSON.stringify({ data: "second" })),
      } as any);

      // Second call after cache is cleared
      const result2 = await getPortfolioData();

      // Should get second result after cache clears
      expect(result2).toEqual({ data: "second" });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
