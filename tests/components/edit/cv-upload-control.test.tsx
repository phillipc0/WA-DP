import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CvUploadControl } from "@/components/portfolioEditor/cv-upload-control";

describe("CvUploadControl", () => {
  const onCvUpload = vi.fn(() => Promise.resolve(true));

  beforeEach(() => {
    vi.clearAllMocks();
    onCvUpload.mockResolvedValue(true);
  });

  it("renders upload button", () => {
    render(<CvUploadControl onCvUpload={onCvUpload} />);

    expect(
      screen.getByRole("button", { name: "Upload CV PDF" }),
    ).toBeInTheDocument();
  });

  it("opens modal with drag and drop area and save button", () => {
    render(<CvUploadControl onCvUpload={onCvUpload} />);

    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    expect(
      screen.getByRole("button", {
        name: "Upload CV PDF by clicking or dragging and dropping",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.queryByLabelText("Paste JSON Data")).not.toBeInTheDocument();
  });

  it("shows selected file name in modal and uploads on save", async () => {
    render(<CvUploadControl onCvUpload={onCvUpload} />);

    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    const fileInput = screen
      .getByRole("button", {
        name: "Upload CV PDF by clicking or dragging and dropping",
      })
      .querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["pdf"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("File selected: resume.pdf")).toBeInTheDocument();

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).not.toBeDisabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onCvUpload).toHaveBeenCalledWith(file);
    });
  });

  it("shows current cv name when provided and no new file selected", () => {
    render(
      <CvUploadControl
        currentCvFileName="current-resume.pdf"
        onCvUpload={onCvUpload}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    expect(
      screen.getByText("Currently uploaded file: current-resume.pdf"),
    ).toBeInTheDocument();
  });

  it("shows both current and selected file fields when both exist", () => {
    render(
      <CvUploadControl
        currentCvFileName="current-resume.pdf"
        onCvUpload={onCvUpload}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    const fileInput = screen
      .getByRole("button", {
        name: "Upload CV PDF by clicking or dragging and dropping",
      })
      .querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["pdf"], "new-resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(
      screen.getByText("Currently uploaded file: current-resume.pdf"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("File selected: new-resume.pdf"),
    ).toBeInTheDocument();
  });

  it("clears selected file after closing the modal", () => {
    render(<CvUploadControl onCvUpload={onCvUpload} />);

    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    const fileInput = screen
      .getByRole("button", {
        name: "Upload CV PDF by clicking or dragging and dropping",
      })
      .querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["pdf"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("File selected: resume.pdf")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    expect(
      screen.queryByText("File selected: resume.pdf"),
    ).not.toBeInTheDocument();
  });

  it("keeps modal open when upload fails", () => {
    onCvUpload.mockResolvedValue(false);
    render(<CvUploadControl onCvUpload={onCvUpload} />);

    fireEvent.click(screen.getByRole("button", { name: "Upload CV PDF" }));

    const fileInput = screen
      .getByRole("button", {
        name: "Upload CV PDF by clicking or dragging and dropping",
      })
      .querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["pdf"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onCvUpload).toHaveBeenCalledWith(file);
    expect(
      screen.getByRole("button", {
        name: "Upload CV PDF by clicking or dragging and dropping",
      }),
    ).toBeInTheDocument();
  });
});
