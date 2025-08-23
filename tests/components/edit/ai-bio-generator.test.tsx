import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { AIBioGenerator } from "@/components/portfolioEditor/ai-bio-generator";
import type { Skill } from "@/types";

// Mock the auth headers
vi.mock("@/lib/auth", () => ({
  getAuthHeaders: vi.fn(() => ({ Authorization: "Bearer test-token" })),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockSkills: Skill[] = [
  { name: "React", level: "Expert" },
  { name: "TypeScript", level: "Advanced" },
  { name: "Node.js", level: "Intermediate" },
];

const defaultProps = {
  name: "John Doe",
  title: "Frontend Developer",
  skills: mockSkills,
  onBioGenerated: vi.fn(),
};

describe("AIBioGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset fetch mock to a default implementation
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ bio: "Test bio" }),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders the AI bio generator component", () => {
    render(<AIBioGenerator {...defaultProps} />);
    
    expect(screen.getByText("Generates a professional bio based on your name, title, and skills")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate AI Bio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument(); // Settings button
  });

  it("shows validation error when name is missing", async () => {
    render(<AIBioGenerator {...defaultProps} name="" />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Name is required to generate a bio")).toBeInTheDocument();
    });
  });

  it("shows validation error when name is only whitespace", async () => {
    render(<AIBioGenerator {...defaultProps} name="   " />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Name is required to generate a bio")).toBeInTheDocument();
    });
  });

  it("shows validation error when title is missing", async () => {
    render(<AIBioGenerator {...defaultProps} title="" />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Professional title is required to generate a bio")).toBeInTheDocument();
    });
  });

  it("shows validation error when title is only whitespace", async () => {
    render(<AIBioGenerator {...defaultProps} title="   " />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Professional title is required to generate a bio")).toBeInTheDocument();
    });
  });

  it("shows validation error when skills array is empty", async () => {
    render(<AIBioGenerator {...defaultProps} skills={[]} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: At least one skill is required to generate a bio")).toBeInTheDocument();
    });
  });

  it("shows validation error when skills is null", async () => {
    render(<AIBioGenerator {...defaultProps} skills={null as any} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: At least one skill is required to generate a bio")).toBeInTheDocument();
    });
  });

  it("successfully generates bio and calls onBioGenerated", async () => {
    const mockBio = "I am a skilled Frontend Developer with expertise in React, TypeScript, and Node.js.";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bio: mockBio }),
    });

    const onBioGenerated = vi.fn();
    render(<AIBioGenerator {...defaultProps} onBioGenerated={onBioGenerated} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(onBioGenerated).toHaveBeenCalledWith(mockBio);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/generate-bio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify({
        name: "John Doe",
        title: "Frontend Developer",
        skills: [
          { name: "React", level: "Expert" },
          { name: "TypeScript", level: "Advanced" },
          { name: "Node.js", level: "Intermediate" },
        ],
      }),
    });
  });

  it("handles API error response with error message", async () => {
    const errorMessage = "API key not configured";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    render(<AIBioGenerator {...defaultProps} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it("handles API error response without error message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<AIBioGenerator {...defaultProps} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Failed to generate bio")).toBeInTheDocument();
    });
  });

  it("handles network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AIBioGenerator {...defaultProps} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });
  });

  it("handles unknown error type", async () => {
    mockFetch.mockRejectedValueOnce("string error");

    render(<AIBioGenerator {...defaultProps} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: An unknown error occurred")).toBeInTheDocument();
    });
  });

  it("opens settings modal when settings button is clicked", () => {
    render(<AIBioGenerator {...defaultProps} />);
    
    const settingsButton = screen.getByRole("button", { name: "" }); // Settings icon button
    fireEvent.click(settingsButton);
    
    // Modal should be open (rendered in the component)
    expect(screen.getByText("Gemini API Configuration")).toBeInTheDocument();
  });

  it("closes settings modal when modal onClose is called", () => {
    render(<AIBioGenerator {...defaultProps} />);
    
    const settingsButton = screen.getByRole("button", { name: "" });
    fireEvent.click(settingsButton);
    
    // Modal is open
    expect(screen.getByText("Gemini API Configuration")).toBeInTheDocument();
    
    // Find and click the cancel button
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    
    // Modal should be closed (not in document)
    expect(screen.queryByText("Gemini API Configuration")).not.toBeInTheDocument();
  });

  it("clears error when starting new generation", async () => {
    // First, trigger an error
    mockFetch.mockRejectedValueOnce(new Error("First error"));
    
    render(<AIBioGenerator {...defaultProps} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: First error")).toBeInTheDocument();
    });

    // Then, mock a successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bio: "Success bio" }),
    });

    // Click generate again
    fireEvent.click(generateButton);
    
    // Error should be cleared (not shown while loading)
    expect(screen.queryByText("Error: First error")).not.toBeInTheDocument();
  });

  it("disables generate button during loading", async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AIBioGenerator {...defaultProps} />);
    
    const generateButton = screen.getByRole("button", { name: "Generate AI Bio" });
    
    expect(generateButton).not.toBeDisabled();
    
    fireEvent.click(generateButton);
    
    expect(generateButton).toBeDisabled();
  });
});