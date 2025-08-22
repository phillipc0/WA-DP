import { NextApiResponse } from "next";

import { AuthenticatedRequest, authenticateToken } from "../../lib/auth";
import { saveApiKey, getApiKey, deleteApiKey } from "../../lib/apiKeyService";

// Handler for GET requests (get API key)
const handleGet = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const apiKey = getApiKey(req.user.username);
    res.status(200).json({ apiKey: apiKey || "" });
  } catch (error) {
    console.error("Error getting API key:", error);
    res.status(500).json({ error: "Failed to retrieve API key" });
  }
};

// Handler for POST requests (save API key)
const handlePost = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (!req.user?.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
    return res.status(400).json({ error: "Valid API key is required" });
  }

  // Basic validation for Gemini API key format
  if (!apiKey.startsWith("AIza") || apiKey.length < 35) {
    return res.status(400).json({
      error:
        "Invalid API key format. Gemini API keys should start with 'AIza' and be at least 35 characters long.",
    });
  }

  try {
    saveApiKey(req.user.username, apiKey.trim());
    res.status(200).json({ message: "API key saved successfully" });
  } catch (error) {
    console.error("Error saving API key:", error);
    res.status(500).json({ error: "Failed to save API key" });
  }
};

// Handler for DELETE requests (delete API key)
const handleDelete = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    deleteApiKey(req.user.username);
    res.status(200).json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    res.status(500).json({ error: "Failed to delete API key" });
  }
};

/**
 * API handler for Gemini API key management operations
 * @param req - Authenticated request object
 * @param res - Next.js API response object
 * @returns Promise that resolves when the request is handled
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else if (req.method === "POST") {
    return handlePost(req, res);
  } else if (req.method === "DELETE") {
    return handleDelete(req, res);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default authenticateToken(handler);
