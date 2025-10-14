import fs from "fs";
import path from "path";

import { NextApiResponse } from "next";

import {
  AuthenticatedRequest,
  authenticateToken,
  handleError,
} from "../../lib/auth";

const DATA_DIR = path.join(process.cwd(), "data");
const PORTFOLIO_FILE = path.join(DATA_DIR, "portfolio.json");

const PUBLIC_PORTFOLIO_FILE = path.join(
  process.cwd(),
  "frontend",
  "portfolio.json",
);

const getPortfolioDataFromFile = (): JSON | null => {
  try {
    if (fs.existsSync(PORTFOLIO_FILE)) {
      const data = fs.readFileSync(PORTFOLIO_FILE, "utf8");
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Error reading portfolio file:", error);
    throw error;
  }
};

const savePortfolioData = (data: JSON): void => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const dataString = JSON.stringify(data, null, 2);

    fs.writeFileSync(PORTFOLIO_FILE, dataString);

    const publicDir = path.dirname(PUBLIC_PORTFOLIO_FILE);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(PUBLIC_PORTFOLIO_FILE, dataString);
  } catch (error) {
    console.error("Error writing portfolio file:", error);
    throw new Error("Failed to save portfolio data");
  }
};

const handler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    if (req.method === "GET") {
      const portfolioData = getPortfolioDataFromFile();
      if (portfolioData) {
        res.status(200).json(portfolioData);
      } else {
        res.status(404).json({ error: "Portfolio data not found" });
      }
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      const portfolioData = req.body as JSON;

      savePortfolioData(portfolioData);
      res.status(200).json({
        message: "Portfolio data saved successfully",
        data: portfolioData,
      });
      return;
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    handleError(res, error, "Portfolio operation failed");
  }
};

const protectedHandler = (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return handler(req, res);
  }

  return authenticateToken(handler)(req, res);
};

export default protectedHandler;
