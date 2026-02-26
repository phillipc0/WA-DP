import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPortfolioData,
  savePortfolioData,
  uploadCVDocument,
} from "@/lib/portfolio";

// Mock authenticatedFetch
vi.mock("@/lib/auth", () => ({
  authenticatedFetch: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

class MockFileReader {
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onerror: (() => void) | null = null;
  result: string | ArrayBuffer | null = null;

  readAsDataURL(_file: Blob) {
    this.result = "data:application/pdf;base64,JVBERi0xLjQgbW9jaw==";
    if (this.onload) {
      this.onload({ target: { result: this.result } } as any);
    }
  }
}

Object.defineProperty(globalThis, "FileReader", {
  value: MockFileReader,
  writable: true,
});

Object.defineProperty(window, "getPortfolioUrl", {
  value: () => `/portfolio.json?_t=${Date.now()}`,
  writable: true,
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getPortfolioData", () => {
    it("returns portfolio data on successful fetch", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPortfolioData),
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
        json: () => Promise.resolve(null),
      } as any);

      const result = await getPortfolioData();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch static portfolio.json:",
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

    it("returns null if portfolio data is not available (404)", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({ error: "Not Found" }),
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
        json: () => Promise.resolve({ data: "first" }),
      } as any);

      // First call
      const result1 = await getPortfolioData();
      expect(result1).toEqual({ data: "first" });

      // Verify cache busting URL was used
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/portfolio.json\?_t=\d+/),
        {
          method: "GET",
        },
      );

      // Mock second call for when cache is cleared
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "second" }),
      } as any);

      // Second call after cache is cleared
      const result2 = await getPortfolioData();

      // Should get second result after cache clears
      expect(result2).toEqual({ data: "second" });
      expect(mockFetch).toHaveBeenCalledTimes(2);
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
  });

  describe("uploadCVDocument", () => {
    it("returns document metadata on successful upload", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const mockAuthenticatedFetch = authenticatedFetch as any;
      const mockCvDocument = {
        fileName: "cv.pdf",
        fileUrl: "/uploads/generated-cv.pdf",
        fileSize: 1234,
        uploadedAt: "2026-02-26T00:00:00.000Z",
      };

      mockAuthenticatedFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ cvDocument: mockCvDocument }),
      } as any);

      const file = new File(["%PDF-1.4 mock"], "cv.pdf", {
        type: "application/pdf",
      });
      const result = await uploadCVDocument(file, "/uploads/old-cv.pdf");

      expect(result).toEqual(mockCvDocument);
      expect(mockAuthenticatedFetch).toHaveBeenCalledWith("/api/cv-document", {
        method: "POST",
        body: expect.any(String),
      });

      const requestBody = JSON.parse(
        mockAuthenticatedFetch.mock.calls[0][1].body,
      );
      expect(requestBody.fileName).toBe("cv.pdf");
      expect(requestBody.mimeType).toBe("application/pdf");
      expect(requestBody.previousFileUrl).toBe("/uploads/old-cv.pdf");
      expect(typeof requestBody.data).toBe("string");
      expect(requestBody.data.length).toBeGreaterThan(0);
    });

    it("returns null when upload fails", async () => {
      const { authenticatedFetch } = await vi.importMock("@/lib/auth");
      const mockAuthenticatedFetch = authenticatedFetch as any;
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockAuthenticatedFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Upload failed" }),
      } as any);

      const file = new File(["%PDF-1.4 mock"], "cv.pdf", {
        type: "application/pdf",
      });
      const result = await uploadCVDocument(file);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to upload CV document:",
        "Upload failed",
      );
    });
  });
});
