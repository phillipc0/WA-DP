import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import { NextApiResponse } from "next";
import protectedHandler from "../../backend/pages/api/portfolio";
import { AuthenticatedRequest } from "../../backend/lib/auth";

// Mock the 'fs' module to control file system operations
vi.mock("fs");

// Mock the authentication middleware so we can test the handler directly
vi.mock("../../backend/lib/auth", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../backend/lib/auth")>();
  return {
    ...actual,
    // We pretend that authentication is always successful
    authenticateToken: vi.fn((handler) => handler),
    handleError: vi.fn((res, _error, message) => {
      res.status(500).json({ error: message || "Internal server error" });
    }),
  };
});

// A helper function to create a mock response object that we can inspect
function createMockRes() {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return res as unknown as NextApiResponse;
}

describe("/api/portfolio handler", () => {
  const mockPortfolioData = { name: "Test User", title: "Developer" };

  beforeEach(() => {
    // Resets all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Ensures cleanup after each test
    vi.restoreAllMocks();
  });

  describe("GET /api/portfolio", () => {
    it("should return 200 and the portfolio data when the file exists", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPortfolioData),
      );

      const req = { method: "GET" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPortfolioData);
    });

    it("should return 404 when the portfolio file does not exist", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const req = { method: "GET" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Portfolio data not found",
      });
    });

    it("should return 500 when the file is corrupt (invalid JSON)", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue("this is not json");

      const req = { method: "GET" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Portfolio operation failed",
      });
    });

    it("should return 500 when reading the file fails", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error("Read error");
      });

      const req = { method: "GET" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Portfolio operation failed",
      });
    });
  });

  describe.each(["POST", "PUT"])("%s /api/portfolio", (method) => {
    it(`should save data and return 200 when the directory exists`, async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      const writeFileSyncSpy = vi
        .spyOn(fs, "writeFileSync")
        .mockImplementation(() => {});

      const req = { method, body: mockPortfolioData } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Portfolio data saved successfully",
        data: mockPortfolioData,
      });
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        expect.stringContaining("portfolio.json"),
        JSON.stringify(mockPortfolioData, null, 2),
      );
    });

    it(`should create the 'data' directory when it does not exist`, async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      const mkdirSyncSpy = vi
        .spyOn(fs, "mkdirSync")
        .mockImplementation(() => "");
      const writeFileSyncSpy = vi
        .spyOn(fs, "writeFileSync")
        .mockImplementation(() => {});

      const req = { method, body: mockPortfolioData } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(mkdirSyncSpy).toHaveBeenCalledWith(
        expect.stringContaining("data"),
        { recursive: true },
      );
      expect(writeFileSyncSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 when writing the file fails", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error("Write error");
      });

      const req = { method, body: mockPortfolioData } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Portfolio operation failed",
      });
    });
  });

  describe("Unsupported Methods", () => {
    it("should return 405 for the DELETE method", async () => {
      const req = { method: "DELETE" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
      expect(res.setHeader).toHaveBeenCalledWith("Allow", [
        "GET",
        "POST",
        "PUT",
      ]);
    });

    it("should return 405 for the PATCH method", async () => {
      const req = { method: "PATCH" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
      expect(res.setHeader).toHaveBeenCalledWith("Allow", [
        "GET",
        "POST",
        "PUT",
      ]);
    });
  });
});
