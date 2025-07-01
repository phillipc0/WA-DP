import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EducationForm from "@/components/portfolioEditor/education-form";
import { Education } from "@/types";

describe("EducationForm", () => {
  const mockEducation: Education = {
    institution: "Test University",
    degree: "Bachelor of Science",
    duration: "2020-2024",
    location: "Test City",
    description: "Test description",
  };

  const mockPortfolioData = {
    education: [mockEducation],
  };

  const mockProps = {
    newEducation: {
      institution: "",
      degree: "",
      duration: "",
      location: "",
      description: "",
    },
    portfolioData: mockPortfolioData,
    handleAddEducation: vi.fn(),
    handleRemoveEducation: vi.fn(),
    handleEditEducation: vi.fn(),
    handleEducationChange: vi.fn(),
    handleEducationDragStart: vi.fn(),
    handleEducationDragOver: vi.fn(),
    handleEducationDragLeave: vi.fn(),
    handleEducationDrop: vi.fn(),
    handleEducationDragEnd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the education form header", () => {
    render(<EducationForm {...mockProps} />);
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("renders the add new education section", () => {
    render(<EducationForm {...mockProps} />);
    expect(screen.getByText("Add New Education")).toBeInTheDocument();
  });

  it("renders all input fields for new education", () => {
    render(<EducationForm {...mockProps} />);
    expect(screen.getByLabelText("Institution")).toBeInTheDocument();
    expect(screen.getByLabelText("Degree")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("displays new education values in input fields", () => {
    const propsWithValues = {
      ...mockProps,
      newEducation: {
        institution: "New University",
        degree: "Master of Arts",
        duration: "2024-2026",
        location: "New City",
        description: "New description",
      },
    };
    render(<EducationForm {...propsWithValues} />);

    expect(screen.getByDisplayValue("New University")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Master of Arts")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-2026")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New City")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New description")).toBeInTheDocument();
  });

  it("calls handleEducationChange when institution input changes", () => {
    render(<EducationForm {...mockProps} />);
    const institutionInput = screen.getByLabelText("Institution");
    fireEvent.change(institutionInput, {
      target: { value: "New Institution" },
    });
    expect(mockProps.handleEducationChange).toHaveBeenCalled();
  });

  it("calls handleEducationChange when degree input changes", () => {
    render(<EducationForm {...mockProps} />);
    const degreeInput = screen.getByLabelText("Degree");
    fireEvent.change(degreeInput, { target: { value: "New Degree" } });
    expect(mockProps.handleEducationChange).toHaveBeenCalled();
  });

  it("calls handleEducationChange when duration input changes", () => {
    render(<EducationForm {...mockProps} />);
    const durationInput = screen.getByLabelText("Duration");
    fireEvent.change(durationInput, { target: { value: "2021-2025" } });
    expect(mockProps.handleEducationChange).toHaveBeenCalled();
  });

  it("calls handleEducationChange when location input changes", () => {
    render(<EducationForm {...mockProps} />);
    const locationInput = screen.getByLabelText("Location");
    fireEvent.change(locationInput, { target: { value: "New Location" } });
    expect(mockProps.handleEducationChange).toHaveBeenCalled();
  });

  it("calls handleEducationChange when description textarea changes", () => {
    render(<EducationForm {...mockProps} />);
    const descriptionTextarea = screen.getByLabelText("Description");
    fireEvent.change(descriptionTextarea, {
      target: { value: "New Description" },
    });
    expect(mockProps.handleEducationChange).toHaveBeenCalled();
  });

  it("disables Add Education button when institution is empty", () => {
    const propsWithEmptyInstitution = {
      ...mockProps,
      newEducation: {
        institution: "",
        degree: "Test Degree",
        duration: "2020-2024",
        location: "Test Location",
        description: "Test Description",
      },
    };
    render(<EducationForm {...propsWithEmptyInstitution} />);
    const addButton = screen.getByText("Add Education");
    expect(addButton.closest("button")).toBeDisabled();
  });

  it("disables Add Education button when degree is empty", () => {
    const propsWithEmptyDegree = {
      ...mockProps,
      newEducation: {
        institution: "Test Institution",
        degree: "",
        duration: "2020-2024",
        location: "Test Location",
        description: "Test Description",
      },
    };
    render(<EducationForm {...propsWithEmptyDegree} />);
    const addButton = screen.getByText("Add Education");
    expect(addButton.closest("button")).toBeDisabled();
  });

  it("enables Add Education button when both institution and degree are filled", () => {
    const propsWithValidData = {
      ...mockProps,
      newEducation: {
        institution: "Test Institution",
        degree: "Test Degree",
        duration: "",
        location: "",
        description: "",
      },
    };
    render(<EducationForm {...propsWithValidData} />);
    const addButton = screen.getByText("Add Education");
    expect(addButton.closest("button")).not.toBeDisabled();
  });

  it("calls handleAddEducation when Add Education button is clicked", () => {
    const propsWithValidData = {
      ...mockProps,
      newEducation: {
        institution: "Test Institution",
        degree: "Test Degree",
        duration: "",
        location: "",
        description: "",
      },
    };
    render(<EducationForm {...propsWithValidData} />);
    const addButton = screen.getByText("Add Education");
    fireEvent.click(addButton);
    expect(mockProps.handleAddEducation).toHaveBeenCalled();
  });

  it("renders existing education entries", () => {
    render(<EducationForm {...mockProps} />);
    expect(screen.getByText("Your Education")).toBeInTheDocument();
    expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
    expect(screen.getByText("🎓 Test University")).toBeInTheDocument();
    expect(screen.getByText("📍 Test City")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("2020-2024")).toBeInTheDocument();
  });

  it("does not render education section when no education exists", () => {
    const propsWithoutEducation = {
      ...mockProps,
      portfolioData: { education: [] },
    };
    render(<EducationForm {...propsWithoutEducation} />);
    expect(screen.queryByText("Your Education")).not.toBeInTheDocument();
  });

  it("does not render location when education has no location", () => {
    const educationWithoutLocation = {
      ...mockEducation,
      location: "",
    };
    const propsWithoutLocation = {
      ...mockProps,
      portfolioData: { education: [educationWithoutLocation] },
    };
    render(<EducationForm {...propsWithoutLocation} />);
    expect(screen.queryByText("📍")).not.toBeInTheDocument();
  });

  it("does not render description when education has no description", () => {
    const educationWithoutDescription = {
      ...mockEducation,
      description: "",
    };
    const propsWithoutDescription = {
      ...mockProps,
      portfolioData: { education: [educationWithoutDescription] },
    };
    render(<EducationForm {...propsWithoutDescription} />);
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("calls handleEditEducation when edit button is clicked", () => {
    render(<EducationForm {...mockProps} />);
    const editButton = screen.getByText("✎");
    fireEvent.click(editButton);
    expect(mockProps.handleEditEducation).toHaveBeenCalledWith(0);
  });

  it("calls handleRemoveEducation when remove button is clicked", () => {
    render(<EducationForm {...mockProps} />);
    const removeButton = screen.getByText("✕");
    fireEvent.click(removeButton);
    expect(mockProps.handleRemoveEducation).toHaveBeenCalledWith(0);
  });

  it("handles drag start event", () => {
    render(<EducationForm {...mockProps} />);
    const educationItem = screen
      .getByText("Bachelor of Science")
      .closest("div[draggable]");
    fireEvent.dragStart(educationItem!);
    expect(mockProps.handleEducationDragStart).toHaveBeenCalled();
  });

  it("handles drag over event", () => {
    render(<EducationForm {...mockProps} />);
    const educationItem = screen
      .getByText("Bachelor of Science")
      .closest("div[draggable]");
    fireEvent.dragOver(educationItem!);
    expect(mockProps.handleEducationDragOver).toHaveBeenCalled();
  });

  it("handles drag leave event", () => {
    render(<EducationForm {...mockProps} />);
    const educationItem = screen
      .getByText("Bachelor of Science")
      .closest("div[draggable]");
    fireEvent.dragLeave(educationItem!);
    expect(mockProps.handleEducationDragLeave).toHaveBeenCalled();
  });

  it("handles drop event", () => {
    render(<EducationForm {...mockProps} />);
    const educationItem = screen
      .getByText("Bachelor of Science")
      .closest("div[draggable]");
    fireEvent.drop(educationItem!);
    expect(mockProps.handleEducationDrop).toHaveBeenCalledWith(
      expect.any(Object),
      0,
    );
  });

  it("handles drag end event", () => {
    render(<EducationForm {...mockProps} />);
    const educationItem = screen
      .getByText("Bachelor of Science")
      .closest("div[draggable]");
    fireEvent.dragEnd(educationItem!);
    expect(mockProps.handleEducationDragEnd).toHaveBeenCalled();
  });

  it("renders multiple education entries correctly", () => {
    const multipleEducation = [
      mockEducation,
      {
        institution: "Second University",
        degree: "Master of Science",
        duration: "2024-2026",
        location: "Second City",
        description: "Second description",
      },
    ];
    const propsWithMultiple = {
      ...mockProps,
      portfolioData: { education: multipleEducation },
    };
    render(<EducationForm {...propsWithMultiple} />);

    expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
    expect(screen.getByText("Master of Science")).toBeInTheDocument();
    expect(screen.getByText("🎓 Test University")).toBeInTheDocument();
    expect(screen.getByText("🎓 Second University")).toBeInTheDocument();
  });

  it("renders drag handle with correct title", () => {
    render(<EducationForm {...mockProps} />);
    const dragHandle = screen.getByTitle("Drag to reorder");
    expect(dragHandle).toBeInTheDocument();
    expect(dragHandle).toHaveTextContent("⋮⋮");
  });

  it("handles null portfolioData education gracefully", () => {
    const propsWithNullEducation = {
      ...mockProps,
      portfolioData: { education: null },
    };
    render(<EducationForm {...propsWithNullEducation} />);
    expect(screen.queryByText("Your Education")).not.toBeInTheDocument();
  });

  it("handles undefined portfolioData education gracefully", () => {
    const propsWithUndefinedEducation = {
      ...mockProps,
      portfolioData: {},
    };
    render(<EducationForm {...propsWithUndefinedEducation} />);
    expect(screen.queryByText("Your Education")).not.toBeInTheDocument();
  });
});
