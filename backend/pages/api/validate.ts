import { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/validate
 * Health-check endpoint for the backend used by the frontend to detect
 * whether the API server is reachable.
 *
 * Responses:
 *   200: { ok: true } - backend is running
 *   405: { error: 'Method not allowed' } - when using non-GET methods
 *   500: { error: 'Internal server error' } - unexpected server error
 *
 * Notes:
 * - Public endpoint; no authentication required.
 *
 * @param {import('next').NextApiRequest} req - Incoming Next.js API request
 * @param {import('next').NextApiResponse} res - Outgoing Next.js API response
 * @returns {void}
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Simple health check endpoint to verify the backend is running
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error validating request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
