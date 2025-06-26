import fs from "fs";
import path from "path";

import { NextApiResponse } from "next";

import {
  AuthenticatedRequest,
  authenticateToken,
  handleError,
} from "../../lib/auth";

const PORTFOLIO_FILE = path.join(process.cwd(), "/frontend/portfolio.json");

const savePortfolioData = (data: JSON): void => {
  try {
    fs.mkdirSync(path.dirname(PORTFOLIO_FILE), { recursive: true });
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing portfolio file:", error);
    throw new Error("Failed to save portfolio data");
  }
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST" || req.method === "PUT") {
      const portfolioData = req.body as JSON;

      savePortfolioData(portfolioData);
      res.status(200).json({
        message: "Portfolio data saved successfully",
        data: portfolioData,
      });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    handleError(res, error, "Portfolio operation failed");
  }
}

export default function protectedHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    return handler(req, res);
  }

  return authenticateToken(handler)(req, res);
}
