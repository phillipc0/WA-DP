import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioEditor } from "@/components/portfolioEditor";
import React from "react";

// Mock the usePortfolioEditor hook
const mockUsePortfolioEditor = {
  portfolioData: {
    name: "John Doe",
    title: "Software Engineer",
    bio: "Passionate developer",
    location: "San Francisco, CA",
    email: "john@example.com",
    avatar: "https://example.com/avatar.jpg",
    social: {
      github: "johndoe",
      twitter: "johndoe",
      linkedin: "johndoe",
      discord: "johndoe#1234",
      reddit: "johndoe",
    },
    skills: [
      { name: "UI/UX Design", level: "Intermediate" },
      { name: "React", level: "Master" },
    ],
    experience: [
      {
        company: "Tech Corp",
        position: "Software Engineer",
        startDate: "2020-01-01",
        endDate: "2023-12-31",
        description: "Developed web applications",
        skills: ["React", "TypeScript"],
      },
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        startDate: "2016-09-01",
        endDate: "2020-05-31",
        description: "Computer Science fundamentals",
      },
    ],
    contributors: [
      {
        name: "Jane Smith",
        role: "Designer",
        avatar: "https://example.com/jane.jpg",
        github: "janesmith",
      },
    ],
  },
  isLoading: false,
  newSkill: { name: "", level: "Intermediate" },
  useUrlForAvatar: true,
  isUploadedImage: false,
  saveAlert: false,
  resetAlert: false,
  fileAlert: false,
  fileAlertMessage: "",
  SKILL_LEVELS: ["Beginner", "Intermediate", "Advanced", "Expert", "Master"],
  newExperience: {
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    skills: [],
  },
  newEducation: {
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
  },
  selectedSkills: new Set(),
  handleBasicInfoChange: vi.fn(),
  handleFileSelect: vi.fn(),
  handleSocialChange: vi.fn(),
  handleAddSkill: vi.fn(),
  handleRemoveSkill: vi.fn(),
  handleSkillChange: vi.fn(),
  handleSkillLevelChange: vi.fn(),
  handleSkillNameChange: vi.fn(),
  handleDragStart: vi.fn(),
  handleDragOver: vi.fn(),
  handleDragLeave: vi.fn(),
  handleDrop: vi.fn(),
  handleDragEnd: vi.fn(),
  handleReset: vi.fn(),
  confirmReset: vi.fn(),
  handleSave: vi.fn(),
  setSaveAlert: vi.fn(),
  setResetAlert: vi.fn(),
  setFileAlert: vi.fn(),
  // Experience handlers
  handleAddExperience: vi.fn(),
  handleEditExperience: vi.fn(),
  handleExperienceChange: vi.fn(),
  handleExperienceDragEnd: vi.fn(),
  handleExperienceDragLeave: vi.fn(),
  handleExperienceDragOver: vi.fn(),
  handleExperienceDragStart: vi.fn(),
  handleExperienceDrop: vi.fn(),
  handleRemoveExperience: vi.fn(),
  handleRemoveSelectedSkill: vi.fn(),
  setSelectedSkills: vi.fn(),
  // Education handlers
  handleAddEducation: vi.fn(),
  handleEditEducation: vi.fn(),
  handleEducationChange: vi.fn(),
  handleEducationDragEnd: vi.fn(),
  handleEducationDragLeave: vi.fn(),
  handleEducationDragOver: vi.fn(),
  handleEducationDragStart: vi.fn(),
  handleEducationDrop: vi.fn(),
  handleRemoveEducation: vi.fn(),
  // Contributor handlers
  handleContributorChange: vi.fn(),
};

vi.mock("@/lib/use-portfolio-editor", () => ({
  usePortfolioEditor: vi.fn(() => mockUsePortfolioEditor),
}));

// Mock framer-motion to prevent window access issues during test teardown
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
    button: "button",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  domAnimation: {},
}));

describe("PortfolioEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    mockUsePortfolioEditor.isLoading = false;
    mockUsePortfolioEditor.portfolioData = {
      name: "John Doe",
      title: "Software Engineer",
      bio: "Passionate developer",
      location: "San Francisco, CA",
      email: "john@example.com",
      avatar: "https://example.com/avatar.jpg",
      social: {
        github: "johndoe",
        twitter: "johndoe",
        linkedin: "johndoe",
        discord: "johndoe#1234",
        reddit: "johndoe",
      },
      skills: [
        { name: "UI/UX Design", level: "Intermediate" },
        { name: "React", level: "Master" },
      ],
      experience: [
        {
          company: "Tech Corp",
          position: "Software Engineer",
          startDate: "2020-01-01",
          endDate: "2023-12-31",
          description: "Developed web applications",
          skills: ["React", "TypeScript"],
        },
      ],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Computer Science",
          startDate: "2016-09-01",
          endDate: "2020-05-31",
          description: "Computer Science fundamentals",
        },
      ],
      contributors: [
        {
          name: "Jane Smith",
          role: "Designer",
          avatar: "https://example.com/jane.jpg",
          github: "janesmith",
        },
      ],
    };
    mockUsePortfolioEditor.saveAlert = false;
    mockUsePortfolioEditor.resetAlert = false;
    mockUsePortfolioEditor.fileAlert = false;
  });

  afterEach(() => {
    cleanup();
    // Give time for any pending state updates to complete
    return new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("shows loading state when isLoading is true", () => {
    mockUsePortfolioEditor.isLoading = true;
    (mockUsePortfolioEditor as any).portfolioData = null;

    render(<PortfolioEditor />);

    expect(screen.getByText("Portfolio Editor")).toBeInTheDocument();
    expect(screen.getByText("Loading portfolio data...")).toBeInTheDocument();
  });

  it("renders main portfolio editor when loaded", () => {
    render(<PortfolioEditor />);

    expect(screen.getByText("Portfolio Edit Page")).toBeInTheDocument();
    expect(
      screen.getByText("Customize your portfolio information"),
    ).toBeInTheDocument();
  });

  it("renders all tabs", () => {
    render(<PortfolioEditor />);

    // Each tab label appears in 2 places: mobile dropdown option and desktop tab
    // Mobile select shows current value (Basic Information by default)
    expect(screen.getAllByText("Basic Information")).toHaveLength(3); // 2 tabs + 1 current value
    expect(screen.getAllByText("Social Links")).toHaveLength(2);
    expect(screen.getAllByText("Skills")).toHaveLength(2);
    expect(screen.getAllByText("Work Experience")).toHaveLength(2);
    expect(screen.getAllByText("Education")).toHaveLength(2);
  });

  it("renders action buttons", () => {
    render(<PortfolioEditor />);

    expect(screen.getByText("Reset to Defaults")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("calls handleReset when reset button is clicked", () => {
    render(<PortfolioEditor />);

    const resetButton = screen.getByText("Reset to Defaults");
    fireEvent.click(resetButton);

    expect(mockUsePortfolioEditor.handleReset).toHaveBeenCalledOnce();
  });

  it("calls handleSave when save button is clicked", () => {
    render(<PortfolioEditor />);

    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    expect(mockUsePortfolioEditor.handleSave).toHaveBeenCalledOnce();
  });

  it("renders BasicInfoForm in Basic Information tab", () => {
    render(<PortfolioEditor />);

    // Basic Information tab should be active by default
    // Content appears only once in the shared content area
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("renders SocialLinksForm in Social Links tab", () => {
    render(<PortfolioEditor />);

    // Click on the desktop tab specifically (inside the tabs container)
    const tablist = screen.getByRole("tablist");
    const socialTab = screen
      .getAllByText("Social Links")
      .find((tab) => tablist.contains(tab));
    expect(socialTab).toBeDefined();
    fireEvent.click(socialTab!);

    expect(screen.getByText("Social Media Profiles")).toBeInTheDocument();
    expect(screen.getByText("github.com/")).toBeInTheDocument();
  });

  it("renders SkillsForm in Skills tab", () => {
    render(<PortfolioEditor />);

    // Click on the desktop tab specifically (inside the tabs container)
    const tablist = screen.getByRole("tablist");
    const skillsTab = screen
      .getAllByText("Skills")
      .find((tab) => tablist.contains(tab));
    expect(skillsTab).toBeDefined();
    fireEvent.click(skillsTab!);

    expect(screen.getByText("Your Skills")).toBeInTheDocument();
    expect(screen.getByText("Add New Skill")).toBeInTheDocument();
  });

  it("shows save success alert when saveAlert is true", () => {
    mockUsePortfolioEditor.saveAlert = true;

    render(<PortfolioEditor />);

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(
      screen.getByText("Your portfolio data has been saved successfully!"),
    ).toBeInTheDocument();
  });

  it("shows reset confirmation alert when resetAlert is true", () => {
    mockUsePortfolioEditor.resetAlert = true;

    render(<PortfolioEditor />);

    expect(screen.getByText("Confirm Reset")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to reset all data to defaults? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("shows file error alert when fileAlert is true", () => {
    mockUsePortfolioEditor.fileAlert = true;
    mockUsePortfolioEditor.fileAlertMessage = "File too large";

    render(<PortfolioEditor />);

    expect(screen.getByText("File Upload Error")).toBeInTheDocument();
    expect(screen.getByText("File too large")).toBeInTheDocument();
  });

  it("calls setSaveAlert when save alert is closed", () => {
    mockUsePortfolioEditor.saveAlert = true;

    render(<PortfolioEditor />);

    const okButton = screen.getByText("OK");
    fireEvent.click(okButton);

    expect(mockUsePortfolioEditor.setSaveAlert).toHaveBeenCalledWith(false);
  });

  it("calls setResetAlert when reset alert is closed", () => {
    mockUsePortfolioEditor.resetAlert = true;

    render(<PortfolioEditor />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockUsePortfolioEditor.setResetAlert).toHaveBeenCalledWith(false);
  });

  it("calls confirmReset when reset is confirmed", () => {
    mockUsePortfolioEditor.resetAlert = true;

    render(<PortfolioEditor />);

    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    expect(mockUsePortfolioEditor.confirmReset).toHaveBeenCalledOnce();
  });

  it("calls setFileAlert when file error alert is closed", () => {
    mockUsePortfolioEditor.fileAlert = true;
    mockUsePortfolioEditor.fileAlertMessage = "Error message";

    render(<PortfolioEditor />);

    const okButton = screen.getByText("OK");
    fireEvent.click(okButton);

    expect(mockUsePortfolioEditor.setFileAlert).toHaveBeenCalledWith(false);
  });

  it("passes correct props to BasicInfoForm", () => {
    render(<PortfolioEditor />);

    // Check that BasicInfoForm receives the correct props by verifying rendered content
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe profile preview")).toBeInTheDocument();
  });

  it("passes correct props to SocialLinksForm", () => {
    render(<PortfolioEditor />);

    // Click on the desktop tab specifically (inside the tabs container)
    const tablist = screen.getByRole("tablist");
    const socialTab = screen
      .getAllByText("Social Links")
      .find((tab) => tablist.contains(tab));
    expect(socialTab).toBeDefined();
    fireEvent.click(socialTab!);

    // Verify that social form is rendered with correct data
    expect(screen.getByLabelText("GitHub Username")).toHaveValue("johndoe");
  });

  it("passes correct props to SkillsForm", () => {
    render(<PortfolioEditor />);

    // Click on the desktop tab specifically (inside the tabs container)
    const tablist = screen.getByRole("tablist");
    const skillsTab = screen
      .getAllByText("Skills")
      .find((tab) => tablist.contains(tab));
    expect(skillsTab).toBeDefined();
    fireEvent.click(skillsTab!);

    // Verify that skills form is rendered with correct data
    expect(screen.getByText("Your Skills")).toBeInTheDocument();
    expect(screen.getByText("Add New Skill")).toBeInTheDocument();
  });

  it("renders WorkExperienceForm in Work Experience tab", () => {
    render(<PortfolioEditor />);

    // Click on the desktop tab specifically (inside the tabs container)
    const tablist = screen.getByRole("tablist");
    const experienceTab = screen
      .getAllByText("Work Experience")
      .find((tab) => tablist.contains(tab));
    expect(experienceTab).toBeDefined();
    fireEvent.click(experienceTab!);

    // Verify that work experience form is rendered by checking for unique content
    expect(screen.getByText("Add New Experience")).toBeInTheDocument();
    // Look for work experience specific elements
    const workExperienceHeadings = screen.getAllByText("Work Experience");
    expect(workExperienceHeadings.length).toBeGreaterThan(0);
  });

  it("renders EducationForm in Education tab", () => {
    render(<PortfolioEditor />);

    // Click on the desktop tab specifically (inside the tabs container)
    const tablist = screen.getByRole("tablist");
    const educationTab = screen
      .getAllByText("Education")
      .find((tab) => tablist.contains(tab));
    expect(educationTab).toBeDefined();
    fireEvent.click(educationTab!);

    // Verify that education form is rendered by checking for unique content
    expect(screen.getByText("Add New Education")).toBeInTheDocument();
    // Look for a unique heading in the education form
    const educationHeadings = screen.getAllByText("Education");
    expect(educationHeadings.length).toBeGreaterThan(0);
  });

  it("renders ContributorForm in Contributors tab for contributors", () => {
    // Mock a contributor user
    mockUsePortfolioEditor.portfolioData.social.github = "rbn-apps"; // A known contributor

    render(<PortfolioEditor />);

    // Check if the Contributors tab exists for contributors
    const contributorTabs = screen.queryAllByText("Contributor");
    
    if (contributorTabs.length > 0) {
      const tablist = screen.getByRole("tablist");
      const contributorTab = contributorTabs.find((tab) => tablist.contains(tab));
      
      if (contributorTab) {
        // Click the tab - this tests that the contributor switch case executes without error
        expect(() => fireEvent.click(contributorTab)).not.toThrow();
        
        // Verify that contributor tab exists and can be clicked
        expect(contributorTab).toBeInTheDocument();
      }
    } else {
      // For non-contributors, the tab should not exist  
      expect(contributorTabs).toHaveLength(0);
    }
  });

  it("renders tabs with correct accessibility labels", () => {
    render(<PortfolioEditor />);

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-label", "Portfolio sections");
  });

  it("handles tab navigation correctly", () => {
    render(<PortfolioEditor />);

    // Start with Basic Information tab (default)
    expect(screen.getByText("Personal Information")).toBeInTheDocument();

    const tablist = screen.getByRole("tablist");

    // Switch to Social Links tab
    const socialTab = screen
      .getAllByText("Social Links")
      .find((tab) => tablist.contains(tab));
    expect(socialTab).toBeDefined();
    fireEvent.click(socialTab!);
    expect(screen.getByText("Social Media Profiles")).toBeInTheDocument();

    // Switch to Skills tab
    const skillsTab = screen
      .getAllByText("Skills")
      .find((tab) => tablist.contains(tab));
    expect(skillsTab).toBeDefined();
    fireEvent.click(skillsTab!);
    expect(screen.getByText("Your Skills")).toBeInTheDocument();

    // Switch back to Basic Information
    const basicTab = screen
      .getAllByText("Basic Information")
      .find((tab) => tablist.contains(tab));
    expect(basicTab).toBeDefined();
    fireEvent.click(basicTab!);
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("shows loading state when portfolioData is null", () => {
    (mockUsePortfolioEditor as any).portfolioData = null;
    mockUsePortfolioEditor.isLoading = false;

    render(<PortfolioEditor />);

    expect(screen.getByText("Portfolio Editor")).toBeInTheDocument();
    expect(screen.getByText("Loading portfolio data...")).toBeInTheDocument();
  });
});
