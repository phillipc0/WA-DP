import { NextApiResponse } from "next";

import {
  AuthenticatedRequest,
  authenticateToken,
  handleError,
} from "../../lib/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    res.status(200).json({
      valid: true,
      user: req.user,
    });
  } catch (error) {
    handleError(res, error, "Token validation failed");
  }
}

export default authenticateToken(handler);
