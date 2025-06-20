import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  saveDraftToCookies,
  loadDraftFromCookies,
  clearDraftFromCookies,
  hasChangesComparedToSaved,
} from "@/lib/cookie-persistence";

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  value: "",
  writable: true,
});

const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("cookie-persistence", () => {
  const mockPortfolioData = {
    name: "John Doe",
    title: "Developer",
    bio: "A developer",
    location: "NYC",
    email: "john@example.com",
    avatar: "avatar.jpg",
    social: { github: "johndoe", twitter: "johndoe", linkedin: "johndoe" },
    skills: [{ name: "JavaScript", level: 90 }],
  };

  beforeEach(() => {
    document.cookie = "";
    mockConsoleError.mockClear();
  });

  describe("saveDraftToCookies", () => {
    it("saves portfolio data to cookies", () => {
      saveDraftToCookies(mockPortfolioData);

      const serializedData = JSON.stringify(mockPortfolioData);
      const encodedData = encodeURIComponent(serializedData);

      expect(document.cookie).toContain(`portfolio_draft=${encodedData}`);
      expect(document.cookie).toContain("path=/");
      expect(document.cookie).toContain("SameSite=Lax");
    });

    it("handles JSON stringify errors", () => {
      const circularRef: any = {};
      circularRef.self = circularRef;

      saveDraftToCookies(circularRef);

      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to save draft to cookies:",
        expect.any(Error),
      );
    });
  });

  describe("loadDraftFromCookies", () => {
    it("returns null when no cookie exists", () => {
      const result = loadDraftFromCookies();
      expect(result).toBeNull();
    });

    it("loads portfolio data from cookies", () => {
      const serializedData = JSON.stringify(mockPortfolioData);
      const encodedData = encodeURIComponent(serializedData);
      document.cookie = `portfolio_draft=${encodedData}`;

      const result = loadDraftFromCookies();
      expect(result).toEqual(mockPortfolioData);
    });

    it("returns null on JSON parse error", () => {
      document.cookie = "portfolio_draft=invalid-json";

      const result = loadDraftFromCookies();
      expect(result).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to load draft from cookies:",
        expect.any(Error),
      );
    });

    it("handles cookies with spaces", () => {
      const serializedData = JSON.stringify(mockPortfolioData);
      const encodedData = encodeURIComponent(serializedData);
      document.cookie = ` portfolio_draft=${encodedData}`;

      const result = loadDraftFromCookies();
      expect(result).toEqual(mockPortfolioData);
    });

    it("finds correct cookie among multiple cookies", () => {
      const serializedData = JSON.stringify(mockPortfolioData);
      const encodedData = encodeURIComponent(serializedData);
      // Set multiple cookies in document.cookie format
      document.cookie = `other_cookie=value1; portfolio_draft=${encodedData}; another_cookie=value2`;

      const result = loadDraftFromCookies();
      expect(result).toEqual(mockPortfolioData);
    });
  });

  describe("clearDraftFromCookies", () => {
    it("clears the draft cookie", () => {
      document.cookie = "portfolio_draft=some-value";

      clearDraftFromCookies();

      expect(document.cookie).toContain(
        "portfolio_draft=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/",
      );
    });
  });

  describe("hasChangesComparedToSaved", () => {
    it("returns false when data is identical", () => {
      const draft = { ...mockPortfolioData };
      const saved = { ...mockPortfolioData };

      const result = hasChangesComparedToSaved(draft, saved);
      expect(result).toBe(false);
    });

    it("returns true when data is different", () => {
      const draft = { ...mockPortfolioData, name: "Jane Doe" };
      const saved = { ...mockPortfolioData };

      const result = hasChangesComparedToSaved(draft, saved);
      expect(result).toBe(true);
    });

    it("returns true when skills array is different", () => {
      const draft = {
        ...mockPortfolioData,
        skills: [{ name: "TypeScript", level: 85 }],
      };
      const saved = { ...mockPortfolioData };

      const result = hasChangesComparedToSaved(draft, saved);
      expect(result).toBe(true);
    });

    it("returns true when nested objects are different", () => {
      const draft = {
        ...mockPortfolioData,
        social: { ...mockPortfolioData.social, github: "janedoe" },
      };
      const saved = { ...mockPortfolioData };

      const result = hasChangesComparedToSaved(draft, saved);
      expect(result).toBe(true);
    });

    it("handles JSON stringify errors gracefully", () => {
      const circularRef: any = {};
      circularRef.self = circularRef;

      const result = hasChangesComparedToSaved(circularRef, mockPortfolioData);
      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to compare portfolio data:",
        expect.any(Error),
      );
    });
  });
});
