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

  it("renders all three tabs", () => {
    render(<PortfolioEditor />);

    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByText("Social Links")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
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
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
  });

  it("renders SocialLinksForm in Social Links tab", () => {
    render(<PortfolioEditor />);

    const socialTab = screen.getByText("Social Links");
    fireEvent.click(socialTab);

    expect(screen.getByText("Social Media Profiles")).toBeInTheDocument();
    expect(screen.getByText("github.com/")).toBeInTheDocument();
  });

  it("renders SkillsForm in Skills tab", () => {
    render(<PortfolioEditor />);

    const skillsTab = screen.getByText("Skills");
    fireEvent.click(skillsTab);

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

    const socialTab = screen.getByText("Social Links");
    fireEvent.click(socialTab);

    // Verify that social form is rendered with correct data
    expect(screen.getByLabelText("GitHub Username")).toHaveValue("johndoe");
  });

  it("passes correct props to SkillsForm", () => {
    render(<PortfolioEditor />);

    const skillsTab = screen.getByText("Skills");
    fireEvent.click(skillsTab);

    // Verify that skills form is rendered with correct data
    expect(screen.getByText("Your Skills")).toBeInTheDocument();
    expect(screen.getByText("Add New Skill")).toBeInTheDocument();
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

    // Switch to Social Links tab
    const socialTab = screen.getByText("Social Links");
    fireEvent.click(socialTab);
    expect(screen.getByText("Social Media Profiles")).toBeInTheDocument();

    // Switch to Skills tab
    const skillsTab = screen.getByText("Skills");
    fireEvent.click(skillsTab);
    expect(screen.getByText("Your Skills")).toBeInTheDocument();

    // Switch back to Basic Information
    const basicTab = screen.getByText("Basic Information");
    fireEvent.click(basicTab);
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
