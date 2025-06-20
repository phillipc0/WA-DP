import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  authenticatedFetch,
  getAuthHeaders,
  getAuthToken,
  getUser,
  isAuthenticated,
  logout,
  migrateOldAuth,
  validateToken,
} from "@/lib/auth";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock window.location
Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

describe("auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("getAuthToken", () => {
    it("returns token from localStorage", () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      expect(getAuthToken()).toBe("test-token");
      expect(localStorageMock.getItem).toHaveBeenCalledWith("authToken");
    });

    it("returns null when no token exists", () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(getAuthToken()).toBeNull();
    });
  });

  describe("getUser", () => {
    it("returns parsed user from localStorage", () => {
      const user = { username: "testuser" };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(user));
      expect(getUser()).toEqual(user);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("user");
    });

    it("returns null when no user exists", () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(getUser()).toBeNull();
    });

    it("returns null when user data is invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("invalid-json");
      expect(getUser()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when both token and user exist", () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "authToken") return "test-token";
        if (key === "user") return JSON.stringify({ username: "testuser" });
        return null;
      });
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false when token is missing", () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "authToken") return null;
        if (key === "user") return JSON.stringify({ username: "testuser" });
        return null;
      });
      expect(isAuthenticated()).toBe(false);
    });

    it("returns false when user is missing", () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "authToken") return "test-token";
        if (key === "user") return null;
        return null;
      });
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("logout", () => {
    it("removes auth data from localStorage", () => {
      logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("authToken");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("isAdmin");
    });
  });

  describe("getAuthHeaders", () => {
    it("returns headers with Authorization when token exists", () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      expect(getAuthHeaders()).toEqual({ Authorization: "Bearer test-token" });
    });

    it("returns empty headers when no token exists", () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(getAuthHeaders()).toEqual({});
    });
  });

  describe("migrateOldAuth", () => {
    it("removes old auth when isAdmin is true", () => {
      localStorageMock.getItem.mockReturnValue("true");
      migrateOldAuth();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("isAdmin");
    });

    it("does nothing when isAdmin is not true", () => {
      localStorageMock.getItem.mockReturnValue("false");
      migrateOldAuth();
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("validateToken", () => {
    it("returns false when no token exists", async () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = await validateToken();
      expect(result).toBe(false);
    });

    it("returns true when token is valid", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ valid: true }),
      });

      const result = await validateToken();
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith("/api/validate-token", {
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      });
    });

    it("calls logout and returns false when token is invalid", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      const result = await validateToken();
      expect(result).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3);
    });

    it("calls logout and returns false on fetch error", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      (fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const result = await validateToken();
      expect(result).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe("authenticatedFetch", () => {
    it("adds auth headers to request", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      (fetch as any).mockResolvedValueOnce({ status: 200 });

      await authenticatedFetch("/api/test");

      expect(fetch).toHaveBeenCalledWith("/api/test", {
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
      });
    });

    it("redirects to home on 401 status", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      (fetch as any).mockResolvedValueOnce({ status: 401 });

      await authenticatedFetch("/api/test");

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3);
      expect(window.location.href).toBe("/");
    });

    it("redirects to home on 403 status", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");
      (fetch as any).mockResolvedValueOnce({ status: 403 });

      await authenticatedFetch("/api/test");

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3);
      expect(window.location.href).toBe("/");
    });
  });
});
