import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import { NextApiResponse } from "next";
import protectedHandler from "../../backend/pages/api/portfolio";
import { AuthenticatedRequest } from "../../backend/lib/auth";

vi.mock("fs");

vi.mock("../../backend/lib/auth", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../backend/lib/auth")>();
  return {
    ...actual,
    authenticateToken: vi.fn((handler) => handler),
    handleError: vi.fn((res, _error, message) => {
      res.status(500).json({ error: message || "Internal server error" });
    }),
  };
});

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
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.each(["POST", "PUT"])("%s /api/portfolio", (method) => {
    it(`should save data and return 200 if the directory exists`, async () => {
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

    it(`should create the 'data' directory if it does not exist`, async () => {
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

    it("should return 500 if writing the file fails", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.spyOn(fs, "writeFileSync").mockImplementation(() => {
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
    it("It should return 405 for the DELETE method", async () => {
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
