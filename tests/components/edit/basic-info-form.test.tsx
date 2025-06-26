import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BasicInfoForm } from "@/components/edit/basic-info-form";

describe("BasicInfoForm", () => {
  const mockPortfolioData = {
    name: "John Doe",
    title: "Software Engineer",
    bio: "Passionate developer",
    location: "San Francisco, CA",
    email: "john@example.com",
    avatar: "https://example.com/avatar.jpg",
  };

  const defaultProps = {
    portfolioData: mockPortfolioData,
    useUrlForAvatar: true,
    isUploadedImage: false,
    onBasicInfoChange: vi.fn(),
    onFileSelect: vi.fn(),
    onToggleAvatarMode: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields with correct values", () => {
    render(<BasicInfoForm {...defaultProps} />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Software Engineer")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Passionate developer"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("San Francisco, CA")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
  });

  it("renders form field labels correctly", () => {
    render(<BasicInfoForm {...defaultProps} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Professional Title")).toBeInTheDocument();
    expect(screen.getByText("Bio")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Profile Picture")).toBeInTheDocument();
  });

  it("calls onBasicInfoChange when input values change", () => {
    const onBasicInfoChange = vi.fn();
    render(
      <BasicInfoForm {...defaultProps} onBasicInfoChange={onBasicInfoChange} />,
    );

    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, {
      target: { name: "name", value: "Jane Doe" },
    });

    expect(onBasicInfoChange).toHaveBeenCalled();
    const call = onBasicInfoChange.mock.calls[0][0];
    expect(call.target.name).toBe("name");
  });

  it("calls onBasicInfoChange when textarea value changes", () => {
    const onBasicInfoChange = vi.fn();
    render(
      <BasicInfoForm {...defaultProps} onBasicInfoChange={onBasicInfoChange} />,
    );

    const bioTextarea = screen.getByDisplayValue("Passionate developer");
    fireEvent.change(bioTextarea, {
      target: { name: "bio", value: "Updated bio" },
    });

    expect(onBasicInfoChange).toHaveBeenCalled();
    const call = onBasicInfoChange.mock.calls[0][0];
    expect(call.target.name).toBe("bio");
  });

  it("renders avatar preview image", () => {
    render(<BasicInfoForm {...defaultProps} />);

    const avatarImage = screen.getByAltText("Profile Preview");
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute(
      "src",
      "https://example.com/avatar.jpg",
    );
  });

  it("shows URL input when useUrlForAvatar is true", () => {
    render(<BasicInfoForm {...defaultProps} useUrlForAvatar={true} />);

    expect(
      screen.getByPlaceholderText("URL to your profile picture"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Select Image")).not.toBeInTheDocument();
  });

  it("shows file upload button when useUrlForAvatar is false", () => {
    render(<BasicInfoForm {...defaultProps} useUrlForAvatar={false} />);

    expect(screen.getByText("Select Image")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("URL to your profile picture"),
    ).not.toBeInTheDocument();
  });

  it("calls onToggleAvatarMode when switch is toggled", () => {
    const onToggleAvatarMode = vi.fn();
    render(
      <BasicInfoForm
        {...defaultProps}
        onToggleAvatarMode={onToggleAvatarMode}
      />,
    );

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(onToggleAvatarMode).toHaveBeenCalledOnce();
  });

  it("shows empty avatar URL input when isUploadedImage is true", () => {
    render(
      <BasicInfoForm
        {...defaultProps}
        useUrlForAvatar={true}
        isUploadedImage={true}
      />,
    );

    const avatarInput = screen.getByPlaceholderText(
      "URL to your profile picture",
    );
    expect(avatarInput).toHaveValue("");
  });

  it("shows actual avatar URL when isUploadedImage is false", () => {
    render(
      <BasicInfoForm
        {...defaultProps}
        useUrlForAvatar={true}
        isUploadedImage={false}
      />,
    );

    const avatarInput = screen.getByPlaceholderText(
      "URL to your profile picture",
    );
    expect(avatarInput).toHaveValue("https://example.com/avatar.jpg");
  });

  it("calls onFileSelect when file is selected", () => {
    const onFileSelect = vi.fn();
    render(
      <BasicInfoForm
        {...defaultProps}
        useUrlForAvatar={false}
        onFileSelect={onFileSelect}
      />,
    );

    // Create a mock file
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    // Get the hidden file input
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const fileInput = fileInputs[0] as HTMLInputElement;

    // Create a mock event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    fireEvent.change(fileInput);

    expect(onFileSelect).toHaveBeenCalledOnce();
  });

  it("renders switch component", () => {
    render(<BasicInfoForm {...defaultProps} useUrlForAvatar={true} />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  it("has proper form field types", () => {
    render(<BasicInfoForm {...defaultProps} />);

    const emailInput = screen.getByDisplayValue("john@example.com");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders card header correctly", () => {
    render(<BasicInfoForm {...defaultProps} />);

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("has proper file input attributes", () => {
    render(<BasicInfoForm {...defaultProps} useUrlForAvatar={false} />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute("accept", "image/*");
    expect(fileInput).toHaveClass("hidden");
  });
});
