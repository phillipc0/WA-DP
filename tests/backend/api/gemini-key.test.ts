import { describe, it, expect, beforeEach, vi } from "vitest";

import handler from "../../../backend/pages/api/gemini-key";
import { AuthenticatedRequest } from "../../../backend/lib/auth";
import * as apiKeyService from "../../../backend/lib/apiKeyService";

// Mock NextApiResponse interface for testing
interface NextApiResponse {
  status: (code: number) => { json: (data: any) => void };
  json: (data: any) => void;
}

// Mock the apiKeyService module
vi.mock("../../../backend/lib/apiKeyService");
const mockApiKeyService = vi.mocked(apiKeyService);

// Mock the auth module
vi.mock("../../../backend/lib/auth", () => ({
  authenticateToken: vi.fn((handlerFn) => handlerFn),
  AuthenticatedRequest: {},
}));

describe("/api/gemini-key", () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonSpy: ReturnType<typeof vi.fn>;
  let statusSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock console.error to suppress expected error logs
    vi.spyOn(console, "error").mockImplementation(() => {});

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {
      user: { username: "testuser" },
      body: {},
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy,
    };
  });

  describe("GET /api/gemini-key", () => {
    beforeEach(() => {
      mockReq.method = "GET";
    });

    it("returns API key for authenticated user", async () => {
      const testApiKey = "AIzaTestKey123";
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockApiKeyService.getApiKey).toHaveBeenCalledWith("testuser");
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({ apiKey: testApiKey });
    });

    it("returns empty string when no API key exists", async () => {
      mockApiKeyService.getApiKey.mockReturnValue(null);

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockApiKeyService.getApiKey).toHaveBeenCalledWith("testuser");
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({ apiKey: "" });
    });

    it("returns 401 when user is not authenticated", async () => {
      mockReq.user = undefined;

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockApiKeyService.getApiKey).not.toHaveBeenCalled();
    });

    it("returns 401 when username is missing", async () => {
      mockReq.user = { username: undefined as any };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockApiKeyService.getApiKey).not.toHaveBeenCalled();
    });

    it("handles service errors", async () => {
      mockApiKeyService.getApiKey.mockImplementation(() => {
        throw new Error("Service error");
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Failed to retrieve API key",
      });
    });
  });

  describe("POST /api/gemini-key", () => {
    beforeEach(() => {
      mockReq.method = "POST";
    });

    it("successfully saves valid API key", async () => {
      const validApiKey = "AIzaValidKey123456789012345678901234567890";
      mockReq.body = { apiKey: validApiKey };
      mockApiKeyService.saveApiKey.mockImplementation(() => {});

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockApiKeyService.saveApiKey).toHaveBeenCalledWith(
        "testuser",
        validApiKey,
      );
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "API key saved successfully",
      });
    });

    it("accepts valid API key with extra spaces and trims before saving", async () => {
      // Test that validation passes and trimming happens
      const apiKeyWithSpaces = "AIzaValidKey123456789012345678901234567890   ";
      const trimmedApiKey = "AIzaValidKey123456789012345678901234567890";
      mockReq.body = { apiKey: apiKeyWithSpaces };
      mockApiKeyService.saveApiKey.mockImplementation(() => {});

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockApiKeyService.saveApiKey).toHaveBeenCalledWith(
        "testuser",
        trimmedApiKey,
      );
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "API key saved successfully",
      });
    });

    it("returns 401 when user is not authenticated", async () => {
      mockReq.user = undefined;
      mockReq.body = { apiKey: "AIzaValidKey123456789012345678901234567890" };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key is missing", async () => {
      mockReq.body = {};

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Valid API key is required",
      });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key is empty string", async () => {
      mockReq.body = { apiKey: "" };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Valid API key is required",
      });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key is only whitespace", async () => {
      mockReq.body = { apiKey: "   " };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Valid API key is required",
      });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key is not a string", async () => {
      mockReq.body = { apiKey: 123 };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Valid API key is required",
      });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key does not start with AIza", async () => {
      mockReq.body = { apiKey: "InvalidKey123456789012345678901234567890" };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error:
          "Invalid API key format. Gemini API keys should start with 'AIza' and be at least 35 characters long.",
      });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key is too short", async () => {
      mockReq.body = { apiKey: "AIzaShort" };

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error:
          "Invalid API key format. Gemini API keys should start with 'AIza' and be at least 35 characters long.",
      });
      expect(mockApiKeyService.saveApiKey).not.toHaveBeenCalled();
    });

    it("handles service errors", async () => {
      mockReq.body = { apiKey: "AIzaValidKey123456789012345678901234567890" };
      mockApiKeyService.saveApiKey.mockImplementation(() => {
        throw new Error("Service error");
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Failed to save API key" });
    });
  });

  describe("DELETE /api/gemini-key", () => {
    beforeEach(() => {
      mockReq.method = "DELETE";
    });

    it("successfully deletes API key", async () => {
      mockApiKeyService.deleteApiKey.mockImplementation(() => {});

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockApiKeyService.deleteApiKey).toHaveBeenCalledWith("testuser");
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "API key deleted successfully",
      });
    });

    it("returns 401 when user is not authenticated", async () => {
      mockReq.user = undefined;

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockApiKeyService.deleteApiKey).not.toHaveBeenCalled();
    });

    it("handles service errors", async () => {
      mockApiKeyService.deleteApiKey.mockImplementation(() => {
        throw new Error("Service error");
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Failed to delete API key",
      });
    });
  });

  describe("unsupported methods", () => {
    it("returns 405 for unsupported HTTP methods", async () => {
      mockReq.method = "PUT";

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(405);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Method not allowed" });
    });
  });
});
