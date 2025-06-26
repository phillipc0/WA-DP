import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPortfolioData,
  savePortfolioData,
  clearPortfolioDataCache,
} from "@/lib/portfolio";

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
    // Reset the cache and pending request state
    clearPortfolioDataCache();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("getPortfolioData", () => {
    it("returns portfolio data on successful fetch", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockPortfolioData),
      } as any);

      const result = await getPortfolioData();

      expect(result).toEqual(mockPortfolioData);
      expect(mockFetch).toHaveBeenCalledWith("/portfolio.json", {
        method: "GET",
      });
    });

    it("returns null and logs error when fetch fails", async () => {
      const mockFetch = vi.mocked(fetch);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
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

      authenticatedFetch.mockResolvedValueOnce({
        ok: true,
      } as any);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(true);
      expect(authenticatedFetch).toHaveBeenCalledWith("/api/portfolio", {
        method: "POST",
        body: JSON.stringify(mockPortfolioData),
      });
    });

    it("returns false and logs error when save fails with error response", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const errorResponse = { error: "Validation failed" };
      authenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue(errorResponse),
      } as any);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save portfolio data:",
        "Validation failed",
      );

      consoleSpy.mockRestore();
    });

    it("returns false and logs error when save fails without readable error", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      authenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockRejectedValue(new Error("JSON parse error")),
      } as any);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save portfolio data:",
        "Unknown error",
      );

      consoleSpy.mockRestore();
    });

    it("returns false and logs error when authenticatedFetch throws exception", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const networkError = new Error("Network error");

      authenticatedFetch.mockRejectedValueOnce(networkError);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving portfolio data:",
        networkError,
      );

      consoleSpy.mockRestore();
    });
  });

});
