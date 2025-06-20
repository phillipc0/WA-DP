import { NextApiResponse } from "next";
import {
  authenticateToken,
  AuthenticatedRequest,
  handleError,
} from "../../lib/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // If we reach here, the token is valid (middleware validated it)
    res.status(200).json({
      valid: true,
      user: req.user,
    });
  } catch (error) {
    handleError(res, error, "Token validation failed");
  }
}

// Always require authentication for this endpoint
export default authenticateToken(handler);
