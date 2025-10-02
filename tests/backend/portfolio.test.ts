import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import fs from "fs";
import protectedHandler from "../../backend/pages/api/portfolio";
import {AuthenticatedRequest} from "../../backend/lib/auth";
import {NextApiResponse} from "next";

vi.mock("fs");

vi.mock("../../backend/lib/auth", async (importOriginal) => {
    const actual =
        await importOriginal<typeof import("../../backend/lib/auth")>();
    return {
        ...actual,
        authenticateToken: vi.fn((handler) => handler),
        handleError: vi.fn((res, _error, message) => {
            res.status(500).json({error: message || "Internal server error"});
        }),
    };
});

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
        setHeader: vi.fn(),
        _getStatus: () => statusCode,
        _getJson: () => jsonBody,
    };
    return res;
}

describe("/api/portfolio handler", () => {
    const mockPortfolioData = {name: "Test User"};

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("GET", () => {
        it("sollte Portfolio-Daten zurückgeben, wenn die Datei existiert", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(
                JSON.stringify(mockPortfolioData),
            );

            const req = {method: "GET"} as AuthenticatedRequest;
            const res = createMockRes();

            await protectedHandler(req, res as unknown as NextApiResponse);

            expect(res._getStatus()).toBe(200);
            expect(res._getJson()).toEqual(mockPortfolioData);
        });

        it("sollte 404 zurückgeben, wenn die Portfolio-Datei nicht existiert", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(false);

            const req = {method: "GET"} as AuthenticatedRequest;
            const res = createMockRes();

            await protectedHandler(req, res as unknown as NextApiResponse);

            expect(res._getStatus()).toBe(404);
            expect(res._getJson()).toEqual({error: "Portfolio data not found"});
        });

        it("sollte 500 zurückgeben, wenn die Datei korrupt ist (ungültiges JSON)", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue("invalid json");

            const req = {method: "GET"} as AuthenticatedRequest;
            const res = createMockRes();

            await protectedHandler(req, res as unknown as NextApiResponse);

            expect(res._getStatus()).toBe(500);
            expect(res._getJson()).toEqual({error: "Portfolio operation failed"});
        });
    });

    describe("POST", () => {
        it("sollte Portfolio-Daten speichern und eine Erfolgsmeldung zurückgeben", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            const writeFileSyncSpy = vi
                .spyOn(fs, "writeFileSync")
                .mockImplementation(() => {
                });

            const req = {
                method: "POST",
                body: mockPortfolioData,
            } as AuthenticatedRequest;
            const res = createMockRes();

            await protectedHandler(req, res as unknown as NextApiResponse);

            expect(res._getStatus()).toBe(200);
            expect(res._getJson()).toEqual({
                message: "Portfolio data saved successfully",
                data: mockPortfolioData,
            });
            expect(writeFileSyncSpy).toHaveBeenCalledWith(
                expect.stringContaining("portfolio.json"),
                JSON.stringify(mockPortfolioData, null, 2),
            );
        });

        it("sollte das data-Verzeichnis erstellen, wenn es nicht existiert", async () => {
            vi.mocked(fs.existsSync).mockReturnValue(false);
            const mkdirSyncSpy = vi
                .spyOn(fs, "mkdirSync")
                .mockImplementation(() => "");
            const writeFileSyncSpy = vi
                .spyOn(fs, "writeFileSync")
                .mockImplementation(() => {
                });

            const req = {
                method: "POST",
                body: mockPortfolioData,
            } as AuthenticatedRequest;
            const res = createMockRes();

            await protectedHandler(req, res as unknown as NextApiResponse);

            expect(mkdirSyncSpy).toHaveBeenCalledWith(
                expect.stringContaining("data"),
                {recursive: true},
            );
            expect(writeFileSyncSpy).toHaveBeenCalled();
            expect(res._getStatus()).toBe(200);
        });
    });

    it("sollte 405 für nicht unterstützte Methoden zurückgeben", async () => {
        const req = {method: "DELETE"} as AuthenticatedRequest;
        const res = createMockRes();

        await protectedHandler(req, res as unknown as NextApiResponse);

        expect(res._getStatus()).toBe(405);
        expect(res._getJson()).toEqual({error: "Method not allowed"});
        expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET", "POST", "PUT"]);
    });
});
