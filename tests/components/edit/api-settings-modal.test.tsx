import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { ApiSettingsModal } from "@/components/portfolioEditor/api-settings-modal";

// Mock the auth headers
vi.mock("@/lib/auth", () => ({
  getAuthHeaders: vi.fn(() => ({ Authorization: "Bearer test-token" })),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
};

describe("ApiSettingsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset fetch mock to a default empty implementation
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders the modal with title and description", () => {
    render(<ApiSettingsModal {...defaultProps} />);
    
    expect(screen.getByText("Gemini API Configuration")).toBeInTheDocument();
    expect(screen.getByText("Configure your Gemini API key to enable AI-powered bio generation.")).toBeInTheDocument();
  });

  it("fetches and displays existing API key when modal opens", async () => {
    const existingApiKey = "AIzaExistingKey123";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: existingApiKey }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(existingApiKey)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/gemini-key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    });
  });

  it("handles fetch error when loading API key", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Failed to load API key")).toBeInTheDocument();
    });
  });

  it("handles API error response when loading API key", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Failed to load API key")).toBeInTheDocument();
    });
  });

  it("does not fetch API key when modal is closed", () => {
    render(<ApiSettingsModal {...defaultProps} isOpen={false} />);
    
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("allows user to input API key", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      expect(input).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Gemini API Key");
    fireEvent.change(input, { target: { value: "AIzaNewKey123" } });
    
    expect(input).toHaveValue("AIzaNewKey123");
  });

  it("toggles API key visibility", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "AIzaTestKey123" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      expect(input).toHaveAttribute("type", "password");
    });

    const toggleButton = screen.getByRole("button", { name: "" }); // Eye icon button
    fireEvent.click(toggleButton);
    
    const input = screen.getByLabelText("Gemini API Key");
    expect(input).toHaveAttribute("type", "text");
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("successfully saves API key", async () => {
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      expect(input).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Gemini API Key");
    fireEvent.change(input, { target: { value: "AIzaValidKey123" } });

    // Mock save request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "API key saved successfully" }),
    });

    const saveButton = screen.getByRole("button", { name: "Save API Key" });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText("API key saved successfully!")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/gemini-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify({ apiKey: "AIzaValidKey123" }),
    });
  });

  it("shows loading state while saving", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      fireEvent.change(input, { target: { value: "AIzaValidKey123" } });
    });

    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const saveButton = screen.getByRole("button", { name: "Save API Key" });
    fireEvent.click(saveButton);
    
    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it("handles save error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      fireEvent.change(input, { target: { value: "AIzaValidKey123" } });
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid API key format" }),
    });

    const saveButton = screen.getByRole("button", { name: "Save API Key" });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Invalid API key format")).toBeInTheDocument();
    });
  });

  it("handles save network error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      fireEvent.change(input, { target: { value: "AIzaValidKey123" } });
    });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const saveButton = screen.getByRole("button", { name: "Save API Key" });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });
  });

  it("disables save button when API key is empty", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: "Save API Key" });
      expect(saveButton).toBeDisabled();
    });
  });

  it("shows delete button when API key exists", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "AIzaExistingKey123" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTitle("Delete API Key")).toBeInTheDocument();
    });
  });

  it("hides delete button when API key is empty", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTitle("Delete API Key")).not.toBeInTheDocument();
    });
  });

  it("successfully deletes API key", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "AIzaExistingKey123" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTitle("Delete API Key")).toBeInTheDocument();
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "API key deleted successfully" }),
    });

    const deleteButton = screen.getByTitle("Delete API Key");
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.getByText("API key deleted successfully!")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/gemini-key", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    });

    // API key input should be empty after deletion
    const input = screen.getByLabelText("Gemini API Key");
    expect(input).toHaveValue("");
  });

  it("handles delete error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "AIzaExistingKey123" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTitle("Delete API Key")).toBeInTheDocument();
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to delete" }),
    });

    const deleteButton = screen.getByTitle("Delete API Key");
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Failed to delete")).toBeInTheDocument();
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    const onClose = vi.fn();
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it("shows help text with link to Google AI Studio", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText("Note: You can get a free Gemini API key from", { exact: false })).toBeInTheDocument();
    });

    const link = screen.getByRole("link", { name: "Google AI Studio" });
    expect(link).toHaveAttribute("href", "https://aistudio.google.com/apikey");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("clears error and success messages when performing new actions", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ apiKey: "AIzaExistingKey123" }),
    });

    render(<ApiSettingsModal {...defaultProps} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText("Gemini API Key");
      expect(input).toBeInTheDocument();
    });

    // Cause an error first
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Test error" }),
    });

    const saveButton = screen.getByRole("button", { name: "Save API Key" });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText("Error: Test error")).toBeInTheDocument();
    });

    // Now try to save again - error should be cleared
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    fireEvent.click(saveButton);
    
    // Error should be cleared immediately when starting new action
    expect(screen.queryByText("Error: Test error")).not.toBeInTheDocument();
  });
});