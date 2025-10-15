import { NextApiResponse } from "next";

import { AuthenticatedRequest, authenticateToken } from "../../lib/auth";
import { getApiKey } from "../../lib/apiKeyService";

// Sanitize input to prevent injection attacks
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>"'&]/g, "") // Remove potentially dangerous characters
    .trim()
    .substring(0, 200); // Limit length
};

/**
 * Handles bio generation requests using Gemini AI API
 * @param req - Authenticated request containing name, title, and skills
 * @param res - API response object
 * @returns Promise that resolves when the request is handled
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!req.user?.username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, title, skills } = req.body;

    if (!name || !title || !skills) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, title, or skills" });
    }

    // Validate and sanitize inputs
    if (typeof name !== "string" || typeof title !== "string") {
      return res.status(400).json({ error: "Invalid input types" });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res
        .status(400)
        .json({ error: "Skills must be a non-empty array" });
    }

    // Get the API key securely
    const GEMINI_API_KEY = getApiKey(req.user.username);

    if (!GEMINI_API_KEY) {
      return res.status(400).json({ error: "API key not configured" });
    }

    // Define skill level priority (higher number = higher proficiency)
    const skillLevelPriority: Record<string, number> = {
      Master: 5,
      Expert: 4,
      Advanced: 3,
      Intermediate: 2,
      Beginner: 1,
    };

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedSkills = skills
      .filter(
        (skill) =>
          skill &&
          typeof skill.name === "string" &&
          typeof skill.level === "string",
      )
      .map((skill) => ({
        name: sanitizeInput(skill.name),
        level: sanitizeInput(skill.level),
      }))
      .sort((a, b) => {
        // Sort by proficiency level (highest first), then by name for consistency
        const levelDiff =
          (skillLevelPriority[b.level] || 0) -
          (skillLevelPriority[a.level] || 0);
        return levelDiff !== 0 ? levelDiff : a.name.localeCompare(b.name);
      })
      .slice(0, 10); // Limit to top 10 skills by proficiency

    const skillsList = sanitizedSkills
      .map((skill) => `${skill.name} (${skill.level})`)
      .join(", ");

    // Create the prompt for the AI
    const prompt = `Generate a professional bio for a developer with the following details:
Name: ${sanitizedName}
Title: ${sanitizedTitle}
Skills with proficiency levels: ${skillsList}

The bio should be concise (2-3 sentences), professional, and highlight the person's expertise based on their skills and proficiency levels. Write in first person without any other context around like "Here is a Bio for...".`;

    // Call the Google Gemini API with a supported model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      console.error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
      throw new Error("External service unavailable");
    }

    const data = await response.json();
    const bio = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!bio) {
      throw new Error("Empty response from Gemini API");
    }

    res.status(200).json({ bio });
  } catch (error) {
    console.error("Error generating bio:", error);
    res.status(500).json({
      error: "Failed to generate bio",
    });
  }
}

export default authenticateToken(handler);
