import { describe, it, expect, beforeEach, vi } from "vitest";

import handler from "../../../backend/pages/api/generate-bio";
import { AuthenticatedRequest } from "../../../backend/lib/auth";
import * as apiKeyService from "../../../backend/lib/apiKeyService";

// Mock NextApiResponse interface for testing
interface NextApiResponse {
  status: (code: number) => { json: (data: any) => void };
  json: (data: any) => void;
}

// Mock the apiKeyService module
vi.mock("../../../backend/lib/apiKeyService");
const mockApiKeyService = vi.mocked(apiKeyService);

// Mock the auth module
vi.mock("../../../backend/lib/auth", () => ({
  authenticateToken: vi.fn((handlerFn) => handlerFn),
  AuthenticatedRequest: {},
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("/api/generate-bio", () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonSpy: ReturnType<typeof vi.fn>;
  let statusSpy: ReturnType<typeof vi.fn>;

  const validRequestBody = {
    name: "John Doe",
    title: "Frontend Developer",
    skills: [
      { name: "React", level: "Expert" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Node.js", level: "Intermediate" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock console.error to suppress expected error logs
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));
    
    mockReq = {
      method: "POST",
      user: { username: "testuser" },
      body: validRequestBody,
    };
    
    mockRes = {
      status: statusSpy,
      json: jsonSpy,
    };
  });

  describe("successful bio generation", () => {
    it("generates bio successfully with valid input", async () => {
      const testApiKey = "AIzaTestKey123";
      const generatedBio = "I am a skilled Frontend Developer with expertise in React, TypeScript, and Node.js.";
      
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: generatedBio }],
              },
            },
          ],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockApiKeyService.getApiKey).toHaveBeenCalledWith("testuser");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("generativelanguage.googleapis.com"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("Frontend Developer"),
        })
      );
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({ bio: generatedBio });
    });

    it("sorts skills by proficiency level", async () => {
      const testApiKey = "AIzaTestKey123";
      const skillsInRandomOrder = [
        { name: "HTML", level: "Beginner" },
        { name: "React", level: "Expert" },
        { name: "CSS", level: "Intermediate" },
        { name: "JavaScript", level: "Advanced" },
        { name: "Vue", level: "Master" },
      ];

      mockReq.body = {
        ...validRequestBody,
        skills: skillsInRandomOrder,
      };

      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Bio text" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = fetchCallBody.contents[0].parts[0].text;
      
      // Should have Vue (Master) first, then React (Expert), then JavaScript (Advanced), etc.
      expect(promptText).toContain("Vue (Master), React (Expert), JavaScript (Advanced), CSS (Intermediate), HTML (Beginner)");
    });

    it("limits skills to top 10 by proficiency", async () => {
      const testApiKey = "AIzaTestKey123";
      const manySkills = Array.from({ length: 15 }, (_, i) => ({
        name: `Skill${i}`,
        level: i % 2 === 0 ? "Expert" : "Beginner",
      }));

      mockReq.body = {
        ...validRequestBody,
        skills: manySkills,
      };

      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Bio text" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = fetchCallBody.contents[0].parts[0].text;
      
      // Should only contain 10 skills
      const skillMatches = promptText.match(/Skill\d+/g) || [];
      expect(skillMatches.length).toBe(10);
    });

    it("sanitizes input to prevent injection", async () => {
      const testApiKey = "AIzaTestKey123";
      mockReq.body = {
        name: "John<script>malicious()</script>Doe",
        title: "Developer&with<tags>",
        skills: [
          { name: "React<img>", level: "Expert" },
          { name: "Normal Skill", level: "Advanced" },
        ],
      };

      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Bio text" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = fetchCallBody.contents[0].parts[0].text;
      
      // Should have dangerous characters removed from user input (<>"'& are removed)
      expect(promptText).not.toContain("<script>");
      expect(promptText).not.toContain("<img>");
      expect(promptText).not.toContain("&");
      expect(promptText).toContain("Johnscriptmalicious()"); // Script tags removed
      expect(promptText).toContain("Developerwith"); // & and tags removed
      expect(promptText).toContain("Reactimg"); // Angle brackets removed
    });

    it("limits input length to prevent abuse", async () => {
      const testApiKey = "AIzaTestKey123";
      const longString = "a".repeat(300); // Longer than 200 char limit
      
      mockReq.body = {
        name: longString,
        title: longString,
        skills: [{ name: longString, level: "Expert" }],
      };

      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Bio text" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = fetchCallBody.contents[0].parts[0].text;
      
      // Should be truncated to 200 characters max
      const nameInPrompt = promptText.match(/Name: ([^\n]+)/)[1];
      const titleInPrompt = promptText.match(/Title: ([^\n]+)/)[1];
      
      expect(nameInPrompt.length).toBeLessThanOrEqual(200);
      expect(titleInPrompt.length).toBeLessThanOrEqual(200);
    });
  });

  describe("authentication and authorization", () => {
    it("returns 401 when user is not authenticated", async () => {
      mockReq.user = undefined;

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockApiKeyService.getApiKey).not.toHaveBeenCalled();
    });

    it("returns 400 when API key is not configured", async () => {
      mockApiKeyService.getApiKey.mockReturnValue(null);

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "API key not configured" });
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("input validation", () => {
    it("returns 405 for non-POST methods", async () => {
      mockReq.method = "GET";

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(405);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("returns 400 when name is missing", async () => {
      mockReq.body = { ...validRequestBody, name: undefined };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ 
        error: "Missing required fields: name, title, or skills" 
      });
    });

    it("returns 400 when title is missing", async () => {
      mockReq.body = { ...validRequestBody, title: undefined };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ 
        error: "Missing required fields: name, title, or skills" 
      });
    });

    it("returns 400 when skills is missing", async () => {
      mockReq.body = { ...validRequestBody, skills: undefined };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ 
        error: "Missing required fields: name, title, or skills" 
      });
    });

    it("returns 400 when name is not a string", async () => {
      mockReq.body = { ...validRequestBody, name: 123 };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Invalid input types" });
    });

    it("returns 400 when title is not a string", async () => {
      mockReq.body = { ...validRequestBody, title: 123 };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Invalid input types" });
    });

    it("returns 400 when skills is not an array", async () => {
      mockReq.body = { ...validRequestBody, skills: "not an array" };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ 
        error: "Skills must be a non-empty array" 
      });
    });

    it("returns 400 when skills array is empty", async () => {
      mockReq.body = { ...validRequestBody, skills: [] };
      mockApiKeyService.getApiKey.mockReturnValue("AIzaTestKey123");

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ 
        error: "Skills must be a non-empty array" 
      });
    });

    it("filters out invalid skills and continues if valid skills remain", async () => {
      const testApiKey = "AIzaTestKey123";
      const skillsWithInvalid = [
        { name: "Valid Skill", level: "Expert" },
        { invalidField: "missing name" }, // Invalid skill object
        null, // Invalid skill
        { name: 123, level: "Advanced" }, // Invalid name type
        { name: "Another Valid", level: 456 }, // Invalid level type
      ];

      mockReq.body = {
        ...validRequestBody,
        skills: skillsWithInvalid,
      };

      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Bio text" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = fetchCallBody.contents[0].parts[0].text;
      
      // Should only include valid skills
      expect(promptText).toContain("Valid Skill (Expert)");
      expect(promptText).not.toContain("missing name");
      expect(promptText).not.toContain("123");
      expect(promptText).not.toContain("456");
    });
  });

  describe("Gemini API integration", () => {
    it("calls Gemini API with correct parameters", async () => {
      const testApiKey = "AIzaTestKey123";
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "Bio text" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${testApiKey}`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("Generate a professional bio"),
        })
      );

      // Also verify the body contains the expected structure
      const fetchCallBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(fetchCallBody).toEqual({
        contents: [
          {
            parts: [
              {
                text: expect.stringContaining("Generate a professional bio"),
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
      });
    });

    it("handles Gemini API error response", async () => {
      const testApiKey = "AIzaTestKey123";
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Failed to generate bio" });
    });

    it("handles network errors", async () => {
      const testApiKey = "AIzaTestKey123";
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Failed to generate bio" });
    });

    it("handles empty response from Gemini API", async () => {
      const testApiKey = "AIzaTestKey123";
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "" }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Failed to generate bio" });
    });

    it("handles malformed response from Gemini API", async () => {
      const testApiKey = "AIzaTestKey123";
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // Missing candidates
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: "Failed to generate bio" });
    });

    it("trims whitespace from generated bio", async () => {
      const testApiKey = "AIzaTestKey123";
      const bioWithWhitespace = "  \n\t  Bio text with whitespace  \n\t  ";
      
      mockApiKeyService.getApiKey.mockReturnValue(testApiKey);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: bioWithWhitespace }] } }],
        }),
      });

      await handler(mockReq as AuthenticatedRequest, mockRes as any);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({ bio: "Bio text with whitespace" });
    });
  });
});