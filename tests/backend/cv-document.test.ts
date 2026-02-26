import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import { NextApiResponse } from "next";

import handler from "../../backend/pages/api/cv-document";
import { AuthenticatedRequest } from "../../backend/lib/auth";

vi.mock("fs");

vi.mock("../../backend/lib/auth", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../backend/lib/auth")>();
  return {
    ...actual,
    authenticateToken: vi.fn((innerHandler) => innerHandler),
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

describe("/api/cv-document handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.spyOn(fs, "mkdirSync").mockImplementation(() => "");
    vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    vi.spyOn(fs, "unlinkSync").mockImplementation(() => {});
  });

  it("uploads a PDF and returns metadata", async () => {
    const req = {
      method: "POST",
      body: {
        fileName: "my-cv.pdf",
        mimeType: "application/pdf",
        data: Buffer.from("%PDF-1.4 mock").toString("base64"),
      },
    } as AuthenticatedRequest;
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "CV uploaded successfully",
        cvDocument: expect.objectContaining({
          fileName: "my-cv.pdf",
          fileUrl: expect.stringMatching(/^\/uploads\/.+\.pdf$/),
        }),
      }),
    );
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  });

  it("returns 400 for invalid file extension", async () => {
    const req = {
      method: "POST",
      body: {
        fileName: "resume.txt",
        mimeType: "text/plain",
        data: Buffer.from("mock").toString("base64"),
      },
    } as AuthenticatedRequest;
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Only PDF files are allowed",
    });
  });

  it("returns 405 for unsupported methods", async () => {
    const req = { method: "GET" } as AuthenticatedRequest;
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["POST"]);
    expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
  });
});
