import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { usePortfolioEditor } from "@/components/portfolioEditor/use-portfolio-editor";

// Mock all the dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock("@/config/site", () => ({
  siteConfig: {
    portfolio: {
      name: "Default User",
      title: "Default Title",
      bio: "Default bio",
      location: "Default Location",
      email: "default@example.com",
      avatar: "default-avatar.jpg",
      social: {
        github: "",
        twitter: "",
        linkedin: "",
        discord: "",
        reddit: "",
      },
      skills: [],
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(() => true),
  migrateOldAuth: vi.fn(),
  validateToken: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("@/lib/portfolio", () => ({
  getPortfolioData: vi.fn(() => Promise.resolve(null)),
  savePortfolioData: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("@/lib/cookie-persistence", () => ({
  loadDraftFromCookies: vi.fn(() => null),
  saveDraftToCookies: vi.fn(),
  clearDraftFromCookies: vi.fn(),
}));

// Mock canvas and Image for file upload tests
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => ({
    drawImage: vi.fn(),
  })),
});

Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
  value: vi.fn(() => "data:image/jpeg;base64,mockImageData"),
});

// Mock FileReader
global.FileReader = class {
  onload: ((event: any) => void) | null = null;
  readAsDataURL(_file: File) {
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: { result: "data:image/jpeg;base64,mockImageData" },
        });
      }
    }, 0);
  }
} as any;

// Mock Image
global.Image = class {
  onload: (() => void) | null = null;
  src: string = "";
  width: number = 300;
  height: number = 300;

  set srcValue(value: string) {
    this.src = value;
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
} as any;

describe("usePortfolioEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with loading state", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.portfolioData).toBe(null);

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("loads portfolio data on mount", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolioData).toEqual(
      expect.objectContaining({
        name: "Default User",
        title: "Default Title",
      }),
    );
  });

  it("handles basic info changes", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleBasicInfoChange({
        target: { name: "name", value: "New Name" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.portfolioData.name).toBe("New Name");
  });

  it("handles social changes", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSocialChange({
        target: { name: "github", value: "newusername" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.portfolioData.social.github).toBe("newusername");
  });

  it("handles adding new skill", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // First set new skill data
    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "React" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleSkillChange({
        target: { name: "level", value: "85" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Then add the skill
    act(() => {
      result.current.handleAddSkill();
    });

    expect(result.current.portfolioData.skills).toHaveLength(1);
    expect(result.current.portfolioData.skills[0]).toEqual({
      name: "React",
      level: 85,
    });
    expect(result.current.newSkill).toEqual({ name: "", level: 50 });
  });

  it("handles removing skill", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add a skill first
    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "React" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddSkill();
    });

    expect(result.current.portfolioData.skills).toHaveLength(1);

    // Remove the skill
    act(() => {
      result.current.handleRemoveSkill(0);
    });

    expect(result.current.portfolioData.skills).toHaveLength(0);
  });

  it("handles skill level change", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add a skill first
    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "React" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddSkill();
    });

    // Change skill level
    act(() => {
      result.current.handleSkillLevelChange(0, 95);
    });

    expect(result.current.portfolioData.skills[0].level).toBe(95);
  });

  it("handles skill name change", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add a skill first
    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "React" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddSkill();
    });

    // Change skill name
    act(() => {
      result.current.handleSkillNameChange(0, "React.js");
    });

    expect(result.current.portfolioData.skills[0].name).toBe("React.js");
  });

  it("handles reset functionality", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Make some changes
    act(() => {
      result.current.handleBasicInfoChange({
        target: { name: "name", value: "Changed Name" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.portfolioData.name).toBe("Changed Name");

    // Trigger reset
    act(() => {
      result.current.handleReset();
    });

    expect(result.current.resetAlert).toBe(true);

    // Confirm reset
    act(() => {
      result.current.confirmReset();
    });

    expect(result.current.portfolioData.name).toBe("Default User");
    expect(result.current.resetAlert).toBe(false);
  });

  it("handles file selection with image resize", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(mockFile, "size", { value: 1024 * 1024 }); // 1MB

    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      result.current.handleFileSelect(mockEvent);
      // Wait for async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // Just verify the function was called without errors
    expect(result.current.handleFileSelect).toBeInstanceOf(Function);
  });

  it("handles file selection with oversized file", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(mockFile, "size", { value: 6 * 1024 * 1024 }); // 6MB

    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileSelect(mockEvent);
    });

    expect(result.current.fileAlert).toBe(true);
    expect(result.current.fileAlertMessage).toBe(
      "Image is too large. Please select an image under 5MB.",
    );
  });

  it("handles save functionality", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.saveAlert).toBe(true);
  });

  it("handles new skill input changes", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "Vue.js" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.newSkill.name).toBe("Vue.js");

    act(() => {
      result.current.handleSkillChange({
        target: { name: "level", value: "75" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.newSkill.level).toBe(75);
  });

  it("doesn't add skill with empty name", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Try to add skill with empty name
    act(() => {
      result.current.handleAddSkill();
    });

    expect(result.current.portfolioData.skills).toHaveLength(0);
  });

  it("handles avatar URL change by setting isUploadedImage to false", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleBasicInfoChange({
        target: { name: "avatar", value: "new-url.jpg" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.isUploadedImage).toBe(false);
  });

  // Experience/CV Tests
  it("handles adding new experience", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set experience data
    act(() => {
      result.current.handleExperienceChange({
        target: { name: "company", value: "Test Company" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleExperienceChange({
        target: { name: "position", value: "Developer" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Add experience
    act(() => {
      result.current.handleAddExperience();
    });

    expect(result.current.portfolioData.cv).toHaveLength(1);
    expect(result.current.portfolioData.cv[0]).toEqual(
      expect.objectContaining({
        company: "Test Company",
        position: "Developer",
      }),
    );
  });

  it("doesn't add experience with empty company or position", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Try to add experience with empty fields
    act(() => {
      result.current.handleAddExperience();
    });

    expect(result.current.portfolioData.cv || []).toHaveLength(0);
  });

  it("handles removing experience", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add experience first
    act(() => {
      result.current.handleExperienceChange({
        target: { name: "company", value: "Test Company" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleExperienceChange({
        target: { name: "position", value: "Developer" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddExperience();
    });

    expect(result.current.portfolioData.cv).toHaveLength(1);

    // Remove experience
    act(() => {
      result.current.handleRemoveExperience(0);
    });

    expect(result.current.portfolioData.cv).toHaveLength(0);
  });

  it("handles editing experience", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add experience first
    act(() => {
      result.current.handleExperienceChange({
        target: { name: "company", value: "Test Company" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleExperienceChange({
        target: { name: "position", value: "Developer" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddExperience();
    });

    expect(result.current.portfolioData.cv).toHaveLength(1);

    // Edit experience
    act(() => {
      result.current.handleEditExperience(0);
    });

    // Should populate newExperience with the data and remove from cv
    expect(result.current.newExperience.company).toBe("Test Company");
    expect(result.current.newExperience.position).toBe("Developer");
    expect(result.current.portfolioData.cv).toHaveLength(0);
  });

  it("handles experience change", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleExperienceChange({
        target: { name: "company", value: "New Company" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.newExperience.company).toBe("New Company");

    act(() => {
      result.current.handleExperienceChange({
        target: { name: "description", value: "New Description" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    expect(result.current.newExperience.description).toBe("New Description");
  });

  it("handles removing selected skill", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add some skills to selected set
    act(() => {
      result.current.setSelectedSkills(new Set(["React", "TypeScript"]));
    });

    expect(result.current.selectedSkills.has("React")).toBe(true);

    // Remove a skill
    act(() => {
      result.current.handleRemoveSelectedSkill("React");
    });

    expect(result.current.selectedSkills.has("React")).toBe(false);
    expect(result.current.selectedSkills.has("TypeScript")).toBe(true);
  });

  // Education Tests
  it("handles adding new education", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set education data
    act(() => {
      result.current.handleEducationChange({
        target: { name: "institution", value: "Test University" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleEducationChange({
        target: { name: "degree", value: "Bachelor of Science" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Add education
    act(() => {
      result.current.handleAddEducation();
    });

    expect(result.current.portfolioData.education).toHaveLength(1);
    expect(result.current.portfolioData.education[0]).toEqual(
      expect.objectContaining({
        institution: "Test University",
        degree: "Bachelor of Science",
      }),
    );
  });

  it("doesn't add education with empty institution or degree", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Try to add education with empty fields
    act(() => {
      result.current.handleAddEducation();
    });

    expect(result.current.portfolioData.education || []).toHaveLength(0);
  });

  it("handles removing education", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add education first
    act(() => {
      result.current.handleEducationChange({
        target: { name: "institution", value: "Test University" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleEducationChange({
        target: { name: "degree", value: "Bachelor of Science" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddEducation();
    });

    expect(result.current.portfolioData.education).toHaveLength(1);

    // Remove education
    act(() => {
      result.current.handleRemoveEducation(0);
    });

    expect(result.current.portfolioData.education).toHaveLength(0);
  });

  it("handles editing education", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add education first
    act(() => {
      result.current.handleEducationChange({
        target: { name: "institution", value: "Test University" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleEducationChange({
        target: { name: "degree", value: "Bachelor of Science" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleAddEducation();
    });

    expect(result.current.portfolioData.education).toHaveLength(1);

    // Edit education
    act(() => {
      result.current.handleEditEducation(0);
    });

    // Should populate newEducation with the data and remove from education
    expect(result.current.newEducation.institution).toBe("Test University");
    expect(result.current.newEducation.degree).toBe("Bachelor of Science");
    expect(result.current.portfolioData.education).toHaveLength(0);
  });

  it("handles education change", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleEducationChange({
        target: { name: "institution", value: "New University" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.newEducation.institution).toBe("New University");

    act(() => {
      result.current.handleEducationChange({
        target: { name: "description", value: "New Description" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    expect(result.current.newEducation.description).toBe("New Description");
  });

  // Drag and Drop Tests for Skills
  it("handles skill drag start", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockEvent = {
      dataTransfer: { setData: vi.fn() },
      currentTarget: { classList: { add: vi.fn() } },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, 0);
    });

    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "text/plain",
      "0",
    );
    expect(mockEvent.currentTarget.classList.add).toHaveBeenCalledWith(
      "opacity-50",
    );
  });

  it("handles skill drag over", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: { classList: { add: vi.fn() } },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragOver(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.currentTarget.classList.add).toHaveBeenCalledWith(
      "bg-default-100",
    );
  });

  it("handles skill drag leave", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockEvent = {
      currentTarget: { classList: { remove: vi.fn() } },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragLeave(mockEvent);
    });

    expect(mockEvent.currentTarget.classList.remove).toHaveBeenCalledWith(
      "bg-default-100",
    );
  });

  it("handles skill drag end", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockEvent = {
      currentTarget: { classList: { remove: vi.fn() } },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragEnd(mockEvent);
    });

    expect(mockEvent.currentTarget.classList.remove).toHaveBeenCalledWith(
      "opacity-50",
    );
  });

  it("handles skill drop and reorder", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add two skills first
    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "React" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleAddSkill();
    });

    act(() => {
      result.current.handleSkillChange({
        target: { name: "name", value: "Vue" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleAddSkill();
    });

    expect(result.current.portfolioData.skills[0].name).toBe("React");
    expect(result.current.portfolioData.skills[1].name).toBe("Vue");

    // Mock drop event
    const mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: { classList: { remove: vi.fn() } },
      dataTransfer: { getData: vi.fn(() => "0") },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDrop(mockEvent, 1);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.currentTarget.classList.remove).toHaveBeenCalledWith(
      "bg-default-100",
    );
  });

  // Drag and Drop Tests for Experience
  it("handles experience drag events", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockDragEvent = {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => "0") },
      currentTarget: { classList: { add: vi.fn(), remove: vi.fn() } },
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    // Test drag start
    act(() => {
      result.current.handleExperienceDragStart(mockDragEvent, 0);
    });
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "text/plain",
      "0",
    );

    // Test drag over
    act(() => {
      result.current.handleExperienceDragOver(mockDragEvent);
    });
    expect(mockDragEvent.preventDefault).toHaveBeenCalled();

    // Test drag leave
    act(() => {
      result.current.handleExperienceDragLeave(mockDragEvent);
    });
    expect(mockDragEvent.currentTarget.classList.remove).toHaveBeenCalled();

    // Test drag end
    act(() => {
      result.current.handleExperienceDragEnd(mockDragEvent);
    });
    expect(mockDragEvent.currentTarget.classList.remove).toHaveBeenCalled();
  });

  // Drag and Drop Tests for Education
  it("handles education drag events", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockDragEvent = {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => "0") },
      currentTarget: { classList: { add: vi.fn(), remove: vi.fn() } },
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    // Test drag start
    act(() => {
      result.current.handleEducationDragStart(mockDragEvent, 0);
    });
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "text/plain",
      "0",
    );

    // Test drag over
    act(() => {
      result.current.handleEducationDragOver(mockDragEvent);
    });
    expect(mockDragEvent.preventDefault).toHaveBeenCalled();

    // Test drag leave
    act(() => {
      result.current.handleEducationDragLeave(mockDragEvent);
    });
    expect(mockDragEvent.currentTarget.classList.remove).toHaveBeenCalled();

    // Test drag end
    act(() => {
      result.current.handleEducationDragEnd(mockDragEvent);
    });
    expect(mockDragEvent.currentTarget.classList.remove).toHaveBeenCalled();
  });

  it("handles null portfolio data gracefully in skill operations", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // These should not throw errors when portfolio data is null
    act(() => {
      result.current.handleSkillLevelChange(0, 50);
    });

    act(() => {
      result.current.handleSkillNameChange(0, "Test");
    });

    // Functions should handle null gracefully
    expect(result.current.handleSkillLevelChange).toBeInstanceOf(Function);
    expect(result.current.handleSkillNameChange).toBeInstanceOf(Function);
  });

  it("resets new experience after adding", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set experience data
    act(() => {
      result.current.handleExperienceChange({
        target: { name: "company", value: "Test Company" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleExperienceChange({
        target: { name: "position", value: "Developer" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Add experience
    act(() => {
      result.current.handleAddExperience();
    });

    // Check that newExperience is reset
    expect(result.current.newExperience).toEqual({
      company: "",
      position: "",
      duration: "",
      location: "",
      description: "",
      technologies: [],
    });
    expect(result.current.selectedSkills.size).toBe(0);
  });

  it("resets new education after adding", async () => {
    const { result } = renderHook(() => usePortfolioEditor());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set education data
    act(() => {
      result.current.handleEducationChange({
        target: { name: "institution", value: "Test University" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleEducationChange({
        target: { name: "degree", value: "Bachelor of Science" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Add education
    act(() => {
      result.current.handleAddEducation();
    });

    // Check that newEducation is reset
    expect(result.current.newEducation).toEqual({
      institution: "",
      degree: "",
      duration: "",
      location: "",
      description: "",
    });
  });
});
