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

  describe("GET /api/portfolio", () => {
    it("sollte 200 und die Portfolio-Daten zurückgeben, wenn die Datei existiert", async () => {
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

    it("sollte 404 zurückgeben, wenn die Portfolio-Datei nicht existiert", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const req = { method: "GET" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Portfolio data not found",
      });
    });

    it("sollte 500 zurückgeben, wenn die Datei korrupt ist (ungültiges JSON)", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue("dies ist kein json");

      const req = { method: "GET" } as AuthenticatedRequest;
      const res = createMockRes();

      await protectedHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Portfolio operation failed",
      });
    });

    it("sollte 500 zurückgeben, wenn das Lesen der Datei fehlschlägt", async () => {
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
    it(`sollte Daten speichern und 200 zurückgeben, wenn das Verzeichnis existiert`, async () => {
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

    it(`sollte das 'data'-Verzeichnis erstellen, wenn es nicht existiert`, async () => {
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

    it("sollte 500 zurückgeben, wenn das Schreiben der Datei fehlschlägt", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      // KORREKTUR: Verwende vi.spyOn() anstelle von vi.mocked()
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
    it("sollte 405 für die DELETE-Methode zurückgeben", async () => {
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

    it("sollte 405 für die PATCH-Methode zurückgeben", async () => {
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
