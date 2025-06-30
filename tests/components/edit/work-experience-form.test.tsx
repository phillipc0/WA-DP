import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WorkExperienceForm from "@/components/portfolioEditor/work-experience-form";
import { Experience } from "@/types";

describe("WorkExperienceForm", () => {
  const mockExperience: Experience = {
    company: "Test Company",
    position: "Software Engineer",
    duration: "2020-2024",
    location: "Test City",
    description: "Test description",
    technologies: ["React", "TypeScript"],
  };

  const mockPortfolioData = {
    cv: [mockExperience],
    skills: [
      { name: "React", level: 85 },
      { name: "TypeScript", level: 90 },
      { name: "Node.js", level: 80 },
    ],
  };

  const mockProps = {
    newExperience: {
      company: "",
      position: "",
      duration: "",
      location: "",
      description: "",
      technologies: [],
    },
    selectedSkills: new Set<string>(),
    setSelectedSkills: vi.fn(),
    portfolioData: mockPortfolioData,
    handleAddExperience: vi.fn(),
    handleRemoveExperience: vi.fn(),
    handleEditExperience: vi.fn(),
    handleExperienceChange: vi.fn(),
    handleRemoveSelectedSkill: vi.fn(),
    handleExperienceDragStart: vi.fn(),
    handleExperienceDragOver: vi.fn(),
    handleExperienceDragLeave: vi.fn(),
    handleExperienceDrop: vi.fn(),
    handleExperienceDragEnd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the work experience form header", () => {
    render(<WorkExperienceForm {...mockProps} />);
    expect(screen.getByText("Work Experience")).toBeInTheDocument();
  });

  it("renders the add new experience section", () => {
    render(<WorkExperienceForm {...mockProps} />);
    expect(screen.getByText("Add New Experience")).toBeInTheDocument();
  });

  it("renders all input fields for new experience", () => {
    render(<WorkExperienceForm {...mockProps} />);
    expect(screen.getByLabelText("Position")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Technologies")).toBeInTheDocument();
  });

  it("displays new experience values in input fields", () => {
    const propsWithValues = {
      ...mockProps,
      newExperience: {
        company: "New Company",
        position: "Senior Developer",
        duration: "2024-Present",
        location: "New City",
        description: "New description",
        technologies: [],
      },
    };
    render(<WorkExperienceForm {...propsWithValues} />);

    expect(screen.getByDisplayValue("New Company")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Senior Developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-Present")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New City")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New description")).toBeInTheDocument();
  });

  it("calls handleExperienceChange when position input changes", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const positionInput = screen.getByLabelText("Position");
    fireEvent.change(positionInput, { target: { value: "New Position" } });
    expect(mockProps.handleExperienceChange).toHaveBeenCalled();
  });

  it("calls handleExperienceChange when company input changes", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const companyInput = screen.getByLabelText("Company");
    fireEvent.change(companyInput, { target: { value: "New Company" } });
    expect(mockProps.handleExperienceChange).toHaveBeenCalled();
  });

  it("calls handleExperienceChange when duration input changes", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const durationInput = screen.getByLabelText("Duration");
    fireEvent.change(durationInput, { target: { value: "2021-2025" } });
    expect(mockProps.handleExperienceChange).toHaveBeenCalled();
  });

  it("calls handleExperienceChange when location input changes", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const locationInput = screen.getByLabelText("Location");
    fireEvent.change(locationInput, { target: { value: "New Location" } });
    expect(mockProps.handleExperienceChange).toHaveBeenCalled();
  });

  it("calls handleExperienceChange when description textarea changes", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const descriptionTextarea = screen.getByLabelText("Description");
    fireEvent.change(descriptionTextarea, {
      target: { value: "New Description" },
    });
    expect(mockProps.handleExperienceChange).toHaveBeenCalled();
  });

  it("disables Add Experience button when position is empty", () => {
    const propsWithEmptyPosition = {
      ...mockProps,
      newExperience: {
        company: "Test Company",
        position: "",
        duration: "2020-2024",
        location: "Test Location",
        description: "Test Description",
        technologies: [],
      },
    };
    render(<WorkExperienceForm {...propsWithEmptyPosition} />);
    const addButton = screen.getByText("Add Experience");
    expect(addButton.closest("button")).toBeDisabled();
  });

  it("disables Add Experience button when company is empty", () => {
    const propsWithEmptyCompany = {
      ...mockProps,
      newExperience: {
        company: "",
        position: "Test Position",
        duration: "2020-2024",
        location: "Test Location",
        description: "Test Description",
        technologies: [],
      },
    };
    render(<WorkExperienceForm {...propsWithEmptyCompany} />);
    const addButton = screen.getByText("Add Experience");
    expect(addButton.closest("button")).toBeDisabled();
  });

  it("enables Add Experience button when both position and company are filled", () => {
    const propsWithValidData = {
      ...mockProps,
      newExperience: {
        company: "Test Company",
        position: "Test Position",
        duration: "",
        location: "",
        description: "",
        technologies: [],
      },
    };
    render(<WorkExperienceForm {...propsWithValidData} />);
    const addButton = screen.getByText("Add Experience");
    expect(addButton.closest("button")).not.toBeDisabled();
  });

  it("calls handleAddExperience when Add Experience button is clicked", () => {
    const propsWithValidData = {
      ...mockProps,
      newExperience: {
        company: "Test Company",
        position: "Test Position",
        duration: "",
        location: "",
        description: "",
        technologies: [],
      },
    };
    render(<WorkExperienceForm {...propsWithValidData} />);
    const addButton = screen.getByText("Add Experience");
    fireEvent.click(addButton);
    expect(mockProps.handleAddExperience).toHaveBeenCalled();
  });

  it("renders existing work experience entries", () => {
    render(<WorkExperienceForm {...mockProps} />);
    expect(screen.getByText("Your Experiences")).toBeInTheDocument();
    expect(
      screen.getByText("Software Engineer at Test Company"),
    ).toBeInTheDocument();
    expect(screen.getByText("📍 Test City")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("2020-2024")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("does not render experience section when no experiences exist", () => {
    const propsWithoutExperience = {
      ...mockProps,
      portfolioData: { ...mockPortfolioData, cv: [] },
    };
    render(<WorkExperienceForm {...propsWithoutExperience} />);
    expect(screen.queryByText("Your Experiences")).not.toBeInTheDocument();
  });

  it("does not render location when experience has no location", () => {
    const experienceWithoutLocation = {
      ...mockExperience,
      location: "",
    };
    const propsWithoutLocation = {
      ...mockProps,
      portfolioData: { ...mockPortfolioData, cv: [experienceWithoutLocation] },
    };
    render(<WorkExperienceForm {...propsWithoutLocation} />);
    expect(screen.queryByText("📍")).not.toBeInTheDocument();
  });

  it("does not render description when experience has no description", () => {
    const experienceWithoutDescription = {
      ...mockExperience,
      description: "",
    };
    const propsWithoutDescription = {
      ...mockProps,
      portfolioData: {
        ...mockPortfolioData,
        cv: [experienceWithoutDescription],
      },
    };
    render(<WorkExperienceForm {...propsWithoutDescription} />);
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("does not render technologies when experience has no technologies", () => {
    const experienceWithoutTechnologies = {
      ...mockExperience,
      technologies: [],
    };
    const propsWithoutTechnologies = {
      ...mockProps,
      portfolioData: {
        ...mockPortfolioData,
        cv: [experienceWithoutTechnologies],
      },
    };
    render(<WorkExperienceForm {...propsWithoutTechnologies} />);
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("calls handleEditExperience when edit button is clicked", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const editButton = screen.getByText("✎");
    fireEvent.click(editButton);
    expect(mockProps.handleEditExperience).toHaveBeenCalledWith(0);
  });

  it("calls handleRemoveExperience when remove button is clicked", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const removeButton = screen.getByText("✕");
    fireEvent.click(removeButton);
    expect(mockProps.handleRemoveExperience).toHaveBeenCalledWith(0);
  });

  it("renders available skills as buttons when skills exist", () => {
    render(<WorkExperienceForm {...mockProps} />);
    expect(screen.getByText("Select from your skills:")).toBeInTheDocument();
    expect(screen.getByText("+ React")).toBeInTheDocument();
    expect(screen.getByText("+ TypeScript")).toBeInTheDocument();
    expect(screen.getByText("+ Node.js")).toBeInTheDocument();
  });

  it("shows message when no skills are available", () => {
    const propsWithoutSkills = {
      ...mockProps,
      portfolioData: { ...mockPortfolioData, skills: [] },
    };
    render(<WorkExperienceForm {...propsWithoutSkills} />);
    expect(
      screen.getByText("Add skills first to select technologies."),
    ).toBeInTheDocument();
  });

  it("calls setSelectedSkills when skill button is clicked", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const skillButton = screen.getByText("+ React");
    fireEvent.click(skillButton);
    expect(mockProps.setSelectedSkills).toHaveBeenCalledWith(
      new Set(["React"]),
    );
  });

  it("renders selected skills with remove buttons", () => {
    const propsWithSelectedSkills = {
      ...mockProps,
      selectedSkills: new Set(["React", "TypeScript"]),
    };
    render(<WorkExperienceForm {...propsWithSelectedSkills} />);

    // Check that selected skills are displayed
    const skillTags = screen
      .getAllByText("React")
      .filter((el) => el.closest(".text-xs.rounded-full.bg-primary-100"));
    expect(skillTags.length).toBeGreaterThan(0);

    const typescriptTags = screen
      .getAllByText("TypeScript")
      .filter((el) => el.closest(".text-xs.rounded-full.bg-primary-100"));
    expect(typescriptTags.length).toBeGreaterThan(0);
  });

  it("calls handleRemoveSelectedSkill when skill remove button is clicked", () => {
    const propsWithSelectedSkills = {
      ...mockProps,
      selectedSkills: new Set(["React"]),
    };
    render(<WorkExperienceForm {...propsWithSelectedSkills} />);

    const removeButton = screen.getByText("×");
    fireEvent.click(removeButton);
    expect(mockProps.handleRemoveSelectedSkill).toHaveBeenCalledWith("React");
  });

  it("filters out selected skills from available skills", () => {
    const propsWithSelectedSkills = {
      ...mockProps,
      selectedSkills: new Set(["React"]),
    };
    render(<WorkExperienceForm {...propsWithSelectedSkills} />);

    // React should not appear in the available skills
    expect(screen.queryByText("+ React")).not.toBeInTheDocument();
    // But other skills should still be available
    expect(screen.getByText("+ TypeScript")).toBeInTheDocument();
    expect(screen.getByText("+ Node.js")).toBeInTheDocument();
  });

  it("handles drag start event", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const experienceItem = screen
      .getByText("Software Engineer at Test Company")
      .closest("div[draggable]");
    fireEvent.dragStart(experienceItem!);
    expect(mockProps.handleExperienceDragStart).toHaveBeenCalled();
  });

  it("handles drag over event", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const experienceItem = screen
      .getByText("Software Engineer at Test Company")
      .closest("div[draggable]");
    fireEvent.dragOver(experienceItem!);
    expect(mockProps.handleExperienceDragOver).toHaveBeenCalled();
  });

  it("handles drag leave event", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const experienceItem = screen
      .getByText("Software Engineer at Test Company")
      .closest("div[draggable]");
    fireEvent.dragLeave(experienceItem!);
    expect(mockProps.handleExperienceDragLeave).toHaveBeenCalled();
  });

  it("handles drop event", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const experienceItem = screen
      .getByText("Software Engineer at Test Company")
      .closest("div[draggable]");
    fireEvent.drop(experienceItem!);
    expect(mockProps.handleExperienceDrop).toHaveBeenCalledWith(
      expect.any(Object),
      0,
    );
  });

  it("handles drag end event", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const experienceItem = screen
      .getByText("Software Engineer at Test Company")
      .closest("div[draggable]");
    fireEvent.dragEnd(experienceItem!);
    expect(mockProps.handleExperienceDragEnd).toHaveBeenCalled();
  });

  it("renders multiple experience entries correctly", () => {
    const multipleExperiences = [
      mockExperience,
      {
        company: "Second Company",
        position: "Senior Developer",
        duration: "2024-Present",
        location: "Second City",
        description: "Second description",
        technologies: ["Vue.js", "Python"],
      },
    ];
    const propsWithMultiple = {
      ...mockProps,
      portfolioData: { ...mockPortfolioData, cv: multipleExperiences },
    };
    render(<WorkExperienceForm {...propsWithMultiple} />);

    expect(
      screen.getByText("Software Engineer at Test Company"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Senior Developer at Second Company"),
    ).toBeInTheDocument();
    expect(screen.getByText("Vue.js")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("renders drag handle with correct title", () => {
    render(<WorkExperienceForm {...mockProps} />);
    const dragHandle = screen.getByTitle("Drag to reorder");
    expect(dragHandle).toBeInTheDocument();
    expect(dragHandle).toHaveTextContent("⋮⋮");
  });

  it("handles null portfolioData cv gracefully", () => {
    const propsWithNullCv = {
      ...mockProps,
      portfolioData: { ...mockPortfolioData, cv: null },
    };
    render(<WorkExperienceForm {...propsWithNullCv} />);
    expect(screen.queryByText("Your Experiences")).not.toBeInTheDocument();
  });

  it("handles undefined portfolioData cv gracefully", () => {
    const propsWithUndefinedCv = {
      ...mockProps,
      portfolioData: { skills: mockPortfolioData.skills },
    };
    render(<WorkExperienceForm {...propsWithUndefinedCv} />);
    expect(screen.queryByText("Your Experiences")).not.toBeInTheDocument();
  });

  it("handles null portfolioData skills gracefully", () => {
    const propsWithNullSkills = {
      ...mockProps,
      portfolioData: { ...mockPortfolioData, skills: null },
    };
    render(<WorkExperienceForm {...propsWithNullSkills} />);
    expect(
      screen.getByText("Add skills first to select technologies."),
    ).toBeInTheDocument();
  });

  it("handles undefined portfolioData skills gracefully", () => {
    const propsWithUndefinedSkills = {
      ...mockProps,
      portfolioData: { cv: mockPortfolioData.cv },
    };
    render(<WorkExperienceForm {...propsWithUndefinedSkills} />);
    expect(
      screen.getByText("Add skills first to select technologies."),
    ).toBeInTheDocument();
  });

  it("handles experience with undefined technologies", () => {
    const experienceWithUndefinedTechnologies = {
      ...mockExperience,
      technologies: undefined,
    };
    const propsWithUndefinedTechnologies = {
      ...mockProps,
      portfolioData: {
        ...mockPortfolioData,
        cv: [experienceWithUndefinedTechnologies],
      },
    };
    render(<WorkExperienceForm {...propsWithUndefinedTechnologies} />);
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });
});
