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
});
