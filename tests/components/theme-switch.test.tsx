import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSwitch } from "@/components/theme-switch";
import React from "react";

// Mock icons
vi.mock("@/components/icons", () => ({
  SunFilledIcon: ({ size }: { size: number }) => (
    <div data-testid="sun-icon" data-size={size}>
      Sun
    </div>
  ),
  MoonFilledIcon: ({ size }: { size: number }) => (
    <div data-testid="moon-icon" data-size={size}>
      Moon
    </div>
  ),
}));

// Mock @heroui/use-theme
const mockSetTheme = vi.fn();
vi.mock("@heroui/use-theme", () => ({
  useTheme: vi.fn(),
}));

// Mock @heroui/switch
vi.mock("@heroui/switch", () => ({
  useSwitch: vi.fn(),
}));

// Mock @react-aria/visually-hidden
vi.mock("@react-aria/visually-hidden", () => ({
  VisuallyHidden: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="visually-hidden">{children}</div>
  ),
}));

describe("ThemeSwitch", () => {
  // Helper function to get mocked hook dependencies
  const getMockHookDependencies = async () => {
    const { useTheme } = await vi.importMock("@heroui/use-theme");
    const { useSwitch } = await vi.importMock("@heroui/switch");

    return {
      mockUseTheme: useTheme as any,
      mockUseSwitch: useSwitch as any,
    };
  };

  // Helper to setup theme and switch mocks with common patterns
  const setupThemeAndSwitch = (
    theme: "light" | "dark",
    isSelected: boolean,
  ) => {
    const mockGetBaseProps = vi.fn(() => ({ className: "base-props" }));
    const mockWrapperSlot = vi.fn(() => "wrapper-class");

    return {
      themeReturn: {
        theme,
        setTheme: mockSetTheme,
      },
      switchReturn: {
        Component: "button",
        slots: { wrapper: mockWrapperSlot },
        isSelected,
        getBaseProps: mockGetBaseProps,
        getInputProps: vi.fn(() => ({ type: "checkbox" })),
        getWrapperProps: vi.fn(() => ({ className: "wrapper-props" })),
      },
      mockGetBaseProps,
      mockWrapperSlot,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders moon icon when theme is light (switch is selected)", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch />);

    await waitFor(() => {
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });
  });

  it("renders sun icon when theme is dark (switch is not selected)", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("dark", false);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch />);

    await waitFor(() => {
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });
  });

  it("displays correct aria-label for light theme", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch />);

    await waitFor(() => {
      expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
    });
  });

  it("displays correct aria-label for dark theme", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("dark", false);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch />);

    await waitFor(() => {
      expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
    });
  });

  it("calls useSwitch with correct props", async () => {
    const { mockUseTheme, mockUseSwitch: mockUseSwitchFn } =
      await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);

    const mockUseSwitch = vi.fn(() => switchReturn);
    mockUseSwitchFn.mockImplementation(mockUseSwitch);

    render(<ThemeSwitch />);

    await waitFor(() => {
      expect(mockUseSwitch).toHaveBeenCalledWith({
        isSelected: true,
        onChange: expect.any(Function),
      });
    });
  });

  it("toggles theme from light to dark when onChange is called", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn } = setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);

    let capturedOnChange: () => void;
    mockUseSwitch.mockImplementation(({ onChange }: { onChange: any }) => {
      capturedOnChange = onChange;
      const { switchReturn } = setupThemeAndSwitch("light", true);
      return switchReturn;
    });

    render(<ThemeSwitch />);

    await waitFor(() => {
      capturedOnChange();
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  it("toggles theme from dark to light when onChange is called", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn } = setupThemeAndSwitch("dark", false);

    mockUseTheme.mockReturnValue(themeReturn);

    let capturedOnChange: () => void;
    mockUseSwitch.mockImplementation(({ onChange }: { onChange: any }) => {
      capturedOnChange = onChange;
      const { switchReturn } = setupThemeAndSwitch("dark", false);
      return switchReturn;
    });

    render(<ThemeSwitch />);

    await waitFor(() => {
      capturedOnChange();
      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
  });

  it("applies custom className prop", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn, mockGetBaseProps } = setupThemeAndSwitch(
      "light",
      true,
    );

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch className="custom-class" />);

    await waitFor(() => {
      expect(mockGetBaseProps).toHaveBeenCalledWith({
        className: expect.stringContaining("custom-class"),
      });
    });
  });

  it("applies custom classNames prop", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn, mockGetBaseProps, mockWrapperSlot } =
      setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    const customClassNames = {
      base: "custom-base",
      wrapper: "custom-wrapper",
    };

    render(<ThemeSwitch classNames={customClassNames} />);

    await waitFor(() => {
      expect(mockGetBaseProps).toHaveBeenCalledWith({
        className: expect.stringContaining("custom-base"),
      });
      expect(mockWrapperSlot).toHaveBeenCalledWith({
        class: expect.stringContaining("custom-wrapper"),
      });
    });
  });

  it("renders icons with correct size", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch />);

    await waitFor(() => {
      const moonIcon = screen.getByTestId("moon-icon");
      expect(moonIcon).toHaveAttribute("data-size", "22");
    });
  });

  it("includes visually hidden input for accessibility", async () => {
    const { mockUseTheme, mockUseSwitch } = await getMockHookDependencies();
    const { themeReturn, switchReturn } = setupThemeAndSwitch("light", true);

    mockUseTheme.mockReturnValue(themeReturn);
    mockUseSwitch.mockReturnValue(switchReturn);

    render(<ThemeSwitch />);

    await waitFor(() => {
      expect(screen.getByTestId("visually-hidden")).toBeInTheDocument();
    });
  });
});
