import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPortfolioData, savePortfolioData, migratePortfolioData } from "@/lib/portfolio";

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
        json: vi.fn().mockResolvedValue(mockPortfolioData),
      } as any);

      const result = await getPortfolioData();

      expect(result).toEqual(mockPortfolioData);
      expect(mockFetch).toHaveBeenCalledWith("/api/portfolio", {
        method: "GET",
      });
    });

    it("returns null and logs error when fetch fails", async () => {
      const mockFetch = vi.mocked(fetch);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      } as any);

      const result = await getPortfolioData();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch portfolio data:", "Not Found");

      consoleSpy.mockRestore();
    });

    it("returns null and logs error when fetch throws exception", async () => {
      const mockFetch = vi.mocked(fetch);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const networkError = new Error("Network error");

      mockFetch.mockRejectedValueOnce(networkError);

      const result = await getPortfolioData();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching portfolio data:", networkError);

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
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const errorResponse = { error: "Validation failed" };
      authenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue(errorResponse),
      } as any);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith("Failed to save portfolio data:", "Validation failed");

      consoleSpy.mockRestore();
    });

    it("returns false and logs error when save fails without readable error", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      authenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockRejectedValue(new Error("JSON parse error")),
      } as any);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith("Failed to save portfolio data:", "Unknown error");

      consoleSpy.mockRestore();
    });

    it("returns false and logs error when authenticatedFetch throws exception", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const networkError = new Error("Network error");

      authenticatedFetch.mockRejectedValueOnce(networkError);

      const result = await savePortfolioData(mockPortfolioData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith("Error saving portfolio data:", networkError);

      consoleSpy.mockRestore();
    });
  });

  describe("migratePortfolioData", () => {
    it("migrates data from localStorage and removes it on success", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockPortfolioData));
      authenticatedFetch.mockResolvedValueOnce({
        ok: true,
      } as any);

      await migratePortfolioData();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("portfolioData");
      expect(authenticatedFetch).toHaveBeenCalledWith("/api/portfolio", {
        method: "POST",
        body: JSON.stringify(mockPortfolioData),
      });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("portfolioData");
    });

    it("does not remove localStorage data when save fails", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockPortfolioData));
      authenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Save failed" }),
      } as any);

      await migratePortfolioData();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("portfolioData");
      expect(authenticatedFetch).toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it("returns early when no localStorage data exists", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");

      mockLocalStorage.getItem.mockReturnValue(null);

      await migratePortfolioData();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("portfolioData");
      expect(authenticatedFetch).not.toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it("handles JSON parse errors gracefully", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      mockLocalStorage.getItem.mockReturnValue("invalid-json");

      await migratePortfolioData();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("portfolioData");
      expect(authenticatedFetch).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("Failed to migrate portfolio data:", expect.any(Error));

      consoleSpy.mockRestore();
    });

    it("handles save errors during migration", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const networkError = new Error("Network error");

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockPortfolioData));
      authenticatedFetch.mockRejectedValueOnce(networkError);

      await migratePortfolioData();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("portfolioData");
      expect(authenticatedFetch).toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
      // The error from savePortfolioData should be logged since the function is called 
      expect(consoleSpy).toHaveBeenCalledWith("Error saving portfolio data:", networkError);

      consoleSpy.mockRestore();
    });

    it("migrates data with minimal required fields", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");

      const minimalData = {
        name: "Jane",
        title: "Designer",
        bio: "Creative designer",
        location: "LA",
        email: "jane@example.com",
        avatar: "jane.jpg",
        social: {
          github: "jane",
          twitter: "jane",
          linkedin: "jane",
        },
        skills: [],
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(minimalData));
      authenticatedFetch.mockResolvedValueOnce({
        ok: true,
      } as any);

      await migratePortfolioData();

      expect(authenticatedFetch).toHaveBeenCalledWith("/api/portfolio", {
        method: "POST",
        body: JSON.stringify(minimalData),
      });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("portfolioData");
    });

    it("migrates data with optional social fields", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");

      const dataWithOptionalFields = {
        ...mockPortfolioData,
        social: {
          github: "user",
          twitter: "user",
          linkedin: "user",
          discord: "user#1234",
          reddit: "user",
        },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(dataWithOptionalFields));
      authenticatedFetch.mockResolvedValueOnce({
        ok: true,
      } as any);

      await migratePortfolioData();

      expect(authenticatedFetch).toHaveBeenCalledWith("/api/portfolio", {
        method: "POST",
        body: JSON.stringify(dataWithOptionalFields),
      });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("portfolioData");
    });
  });
});