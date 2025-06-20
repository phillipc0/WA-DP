import fs from "fs";
import path from "path";

import { NextApiResponse } from "next";

import {
  AuthenticatedRequest,
  authenticateToken,
  handleError,
} from "../../lib/auth";

const PORTFOLIO_FILE = path.join(process.cwd(), "portfolio.json");

interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  skills: Array<{
    name: string;
    level: number;
  }>;
}

const getPortfolioData = (): PortfolioData | null => {
  try {
    if (!fs.existsSync(PORTFOLIO_FILE)) {
      return null;
    }
    const data = fs.readFileSync(PORTFOLIO_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading portfolio file:", error);
    return null;
  }
};

const savePortfolioData = (data: PortfolioData): void => {
  try {
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing portfolio file:", error);
    throw new Error("Failed to save portfolio data");
  }
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const portfolioData = getPortfolioData();

      if (!portfolioData) {
        res.status(404).json({ error: "Portfolio data not found" });
        return;
      }

      res.status(200).json(portfolioData);
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      const portfolioData = req.body as PortfolioData;

      if (!portfolioData.name || !portfolioData.email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }

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
