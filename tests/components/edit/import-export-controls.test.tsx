import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ImportExportControls } from "@/components/portfolioEditor/import-export-controls";
import * as portfolioExport from "@/lib/portfolio-export";

// Mock the portfolio-export module
vi.mock("@/lib/portfolio-export", () => ({
  downloadJSON: vi.fn(),
  validatePortfolioData: vi.fn(),
  parseJSONFile: vi.fn(),
}));

// Mock FileReader
global.FileReader = class MockFileReader {
  readAsText = vi.fn();
  result = "";
  onload: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  onabort: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  onloadend: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  onloadstart: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  onprogress: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  readyState = 0;
  error: DOMException | null = null;
  EMPTY = 0;
  LOADING = 1;
  DONE = 2;
  abort = vi.fn();
  readAsArrayBuffer = vi.fn();
  readAsBinaryString = vi.fn();
  readAsDataURL = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn();

  constructor() {
    // Auto-trigger onload after a brief delay to simulate file reading
    setTimeout(() => {
      if (this.onload) {
        this.onload({} as ProgressEvent<FileReader>);
      }
    }, 0);
  }
} as any;

describe("ImportExportControls", () => {
  const mockPortfolioData = {
    name: "John Doe",
    title: "Software Developer",
    bio: "Software Developer",
    location: "New York",
    email: "john@example.com",
    avatar: "avatar.jpg",
    skills: [{ name: "React", level: 90 }],
    social: { github: "johndoe" },
    cv: [],
    education: [],
  };

  const mockOnImport = vi.fn();

  const defaultProps = {
    portfolioData: mockPortfolioData,
    onImport: mockOnImport,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(portfolioExport.validatePortfolioData).mockReturnValue({
      isValid: true,
      errors: [],
    });
  });

  describe("Export functionality", () => {
    it("renders export button", () => {
      render(<ImportExportControls {...defaultProps} />);

      expect(screen.getByText("Export Portfolio Data")).toBeInTheDocument();
    });

    it("calls downloadJSON when export button is clicked", () => {
      render(<ImportExportControls {...defaultProps} />);

      const exportButton = screen.getByText("Export Portfolio Data");
      fireEvent.click(exportButton);

      expect(portfolioExport.downloadJSON).toHaveBeenCalledWith(
        mockPortfolioData,
        "portfolio-data.json",
      );
    });

    it("shows error alert when export fails", () => {
      vi.mocked(portfolioExport.downloadJSON).mockImplementation(() => {
        throw new Error("Export failed");
      });

      render(<ImportExportControls {...defaultProps} />);

      const exportButton = screen.getByText("Export Portfolio Data");
      fireEvent.click(exportButton);

      expect(
        screen.getByText("Failed to export portfolio data"),
      ).toBeInTheDocument();
    });
  });

  describe("Import functionality", () => {
    it("renders import button", () => {
      render(<ImportExportControls {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: "Import Portfolio Data" }),
      ).toBeInTheDocument();
    });

    it("opens modal when import button is clicked", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      expect(screen.getByText("Upload JSON File")).toBeInTheDocument();
      expect(screen.getByText("Paste JSON Data")).toBeInTheDocument();
      expect(screen.getByText("OR")).toBeInTheDocument();
    });

    it("shows file input and textarea in modal", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      expect(screen.getByText("Upload JSON File")).toBeInTheDocument();
      expect(screen.getByLabelText("Paste JSON Data")).toBeInTheDocument();
      expect(screen.getByText("OR")).toBeInTheDocument();
    });

    it("disables import button when no data is provided", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      expect(modalImportButton).toBeDisabled();
    });

    it("enables import button when text is provided", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, { target: { value: '{"name": "Test"}' } });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      expect(modalImportButton).not.toBeDisabled();
    });

    it("clears text when file is selected", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText(
        "Paste JSON Data",
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: '{"name": "Test"}' } });

      // Get the hidden file input inside the drag & drop zone
      const fileInput = screen
        .getByRole("button", {
          name: "Upload JSON file by clicking or dragging and dropping",
        })
        .querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['{"name": "FromFile"}'], "test.json", {
        type: "application/json",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(textarea.value).toBe("");
    });

    it("shows file name when file is selected", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      // Get the hidden file input inside the drag & drop zone
      const fileInput = screen
        .getByRole("button", {
          name: "Upload JSON file by clicking or dragging and dropping",
        })
        .querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['{"name": "Test"}'], "portfolio.json", {
        type: "application/json",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(
        screen.getByText("File selected: portfolio.json"),
      ).toBeInTheDocument();
    });

    it("shows error for invalid file type", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      // Get the hidden file input inside the drag & drop zone
      const fileInput = screen
        .getByRole("button", {
          name: "Upload JSON file by clicking or dragging and dropping",
        })
        .querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(
        screen.getByText("Please select a valid JSON file"),
      ).toBeInTheDocument();
    });

    it("clears file when text is entered", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      // Get the hidden file input inside the drag & drop zone
      const fileInput = screen
        .getByRole("button", {
          name: "Upload JSON file by clicking or dragging and dropping",
        })
        .querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['{"name": "Test"}'], "test.json", {
        type: "application/json",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText("File selected: test.json")).toBeInTheDocument();

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, { target: { value: '{"name": "FromText"}' } });

      expect(
        screen.queryByText("File selected: test.json"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Import validation", () => {
    it("shows validation errors when data is invalid", async () => {
      vi.mocked(portfolioExport.validatePortfolioData).mockReturnValue({
        isValid: false,
        errors: ["Invalid field: name must be a string", "Skills must be an array"],
      });

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      // Use data with invalid structure to trigger validation
      const invalidData = {
        name: 123, // Invalid type - should be string
        skills: "not-an-array", // Invalid type - should be array
      };
      fireEvent.change(textarea, {
        target: { value: JSON.stringify(invalidData) },
      });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(screen.getByText("Validation Errors:")).toBeInTheDocument();
        expect(screen.getByText("• Invalid field: name must be a string")).toBeInTheDocument();
        expect(
          screen.getByText("• Skills must be an array"),
        ).toBeInTheDocument();
      });
    });

    it("shows error for invalid JSON format", async () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, { target: { value: "invalid json" } });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(screen.getByText("• Invalid JSON format")).toBeInTheDocument();
      });
    });

    it("shows disabled import button when no data is provided", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      expect(modalImportButton).toBeDisabled();
    });
  });

  describe("Successful import", () => {
    it("calls onImport and closes modal on successful import", async () => {
      const testData = {
        name: "Imported User",
        title: "Developer",
        bio: "Test bio",
        location: "Test Location",
        email: "test@example.com",
        skills: [],
        social: {},
        cv: [],
        education: [],
      };

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, {
        target: { value: JSON.stringify(testData) },
      });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith(testData);
        // Check that the import modal is closed by looking for the textarea which should not be visible
        expect(
          screen.queryByLabelText("Paste JSON Data"),
        ).not.toBeInTheDocument();
      });
    });

    it("shows success message after successful import", async () => {
      const testData = {
        name: "Imported User",
        title: "Developer",
        bio: "Test bio",
        location: "Test Location",
        email: "test@example.com",
        skills: [],
        social: {},
        cv: [],
        education: [],
      };

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, {
        target: { value: JSON.stringify(testData) },
      });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(
          screen.getByText("Portfolio data imported successfully!"),
        ).toBeInTheDocument();
      });
    });

    it("imports from file successfully", async () => {
      const testData = {
        name: "File User",
        title: "Developer",
        bio: "Test bio",
        location: "Test Location",
        email: "test@example.com",
        skills: [],
        social: {},
        cv: [],
        education: [],
      };
      vi.mocked(portfolioExport.parseJSONFile).mockResolvedValue(testData);

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      // Get the hidden file input inside the drag & drop zone
      const fileInput = screen
        .getByRole("button", {
          name: "Upload JSON file by clicking or dragging and dropping",
        })
        .querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File([JSON.stringify(testData)], "test.json", {
        type: "application/json",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(portfolioExport.parseJSONFile).toHaveBeenCalledWith(file);
        expect(mockOnImport).toHaveBeenCalledWith(testData);
      });
    });

    it("imports minimal data successfully", async () => {
      const minimalData = { name: "Minimal User" };

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, {
        target: { value: JSON.stringify(minimalData) },
      });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith(minimalData);
        expect(
          screen.queryByLabelText("Paste JSON Data"),
        ).not.toBeInTheDocument();
      });
    });

    it("imports empty object successfully", async () => {
      const emptyData = {};

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, {
        target: { value: JSON.stringify(emptyData) },
      });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith(emptyData);
        expect(
          screen.queryByLabelText("Paste JSON Data"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Modal controls", () => {
    it("closes modal when cancel button is clicked", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Upload JSON File")).not.toBeInTheDocument();
    });

    it("resets form when modal is closed", () => {
      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      fireEvent.change(textarea, { target: { value: '{"test": "data"}' } });

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      // Reopen modal
      fireEvent.click(importButton);

      const newTextarea = screen.getByLabelText(
        "Paste JSON Data",
      ) as HTMLTextAreaElement;
      expect(newTextarea.value).toBe("");
    });
  });

  describe("Error handling", () => {
    it("shows error when import fails", async () => {
      vi.mocked(portfolioExport.validatePortfolioData).mockReturnValue({
        isValid: true,
        errors: [],
      });

      // Mock onImport to throw an error
      const failingOnImport = vi.fn().mockImplementation(() => {
        throw new Error("Import failed");
      });

      render(
        <ImportExportControls {...defaultProps} onImport={failingOnImport} />,
      );

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      const textarea = screen.getByLabelText("Paste JSON Data");
      const completeTestData = {
        name: "Test User",
        title: "Developer",
        bio: "Test bio",
        location: "Test Location",
        email: "test@example.com",
        skills: [],
        social: {},
        cv: [],
        education: [],
      };
      fireEvent.change(textarea, {
        target: { value: JSON.stringify(completeTestData) },
      });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to import portfolio data"),
        ).toBeInTheDocument();
      });
    });

    it("handles file parsing errors", async () => {
      vi.mocked(portfolioExport.parseJSONFile).mockRejectedValue(
        new Error("Parse failed"),
      );

      render(<ImportExportControls {...defaultProps} />);

      const importButton = screen.getByRole("button", {
        name: "Import Portfolio Data",
      });
      fireEvent.click(importButton);

      // Get the hidden file input inside the drag & drop zone
      const fileInput = screen
        .getByRole("button", {
          name: "Upload JSON file by clicking or dragging and dropping",
        })
        .querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["invalid"], "test.json", {
        type: "application/json",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      const modalImportButton = screen.getByRole("button", { name: "Import" });
      fireEvent.click(modalImportButton);

      await waitFor(() => {
        expect(screen.getByText("• Invalid JSON format")).toBeInTheDocument();
      });
    });
  });
});
