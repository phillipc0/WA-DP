import { describe, it, expect } from "vitest";
import handler from "../../backend/pages/api/validate";

function createMockRes() {
  let statusCode: number | null = null;
  let jsonBody: any = null;
  const res: any = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(payload: any) {
      jsonBody = payload;
      return res;
    },
    // helpers to inspect
    _getStatus() {
      return statusCode;
    },
    _getJson() {
      return jsonBody;
    },
  };
  return res;
}

describe("/api/validate handler", () => {
  it("returns 200 and { ok: true } for GET", () => {
    const req: any = { method: "GET" };
    const res: any = createMockRes();

    handler(req, res);

    expect(res._getStatus()).toBe(200);
    expect(res._getJson()).toEqual({ ok: true });
  });

  it("returns 405 for non-GET", () => {
    const req: any = { method: "POST" };
    const res: any = createMockRes();

    handler(req, res);

    expect(res._getStatus()).toBe(405);
    expect(res._getJson()).toEqual({ error: "Method not allowed" });
  });
});
