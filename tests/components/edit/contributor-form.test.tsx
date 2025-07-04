import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ContributorForm } from "@/components/portfolioEditor/contributor-form";

describe("ContributorForm", () => {
  const mockOnContributorChange = vi.fn();

  const defaultProps = {
    portfolioData: {
      contributor: {
        enableContributorStatus: false,
        showGoldenBoxShadow: false,
      },
    },
    onContributorChange: mockOnContributorChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders card header correctly", () => {
      render(<ContributorForm {...defaultProps} />);

      expect(screen.getByText("Contributor Settings")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Contributor Settings",
      );
    });

    it("renders description text", () => {
      render(<ContributorForm {...defaultProps} />);

      expect(
        screen.getByText(
          "These settings allow you to customize the contributor features of your portfolio.",
        ),
      ).toBeInTheDocument();
    });

    it("renders both switch controls", () => {
      render(<ContributorForm {...defaultProps} />);

      expect(screen.getByText("Enable Contributor Status")).toBeInTheDocument();
      expect(
        screen.getByText("Show the contributor button on your profile"),
      ).toBeInTheDocument();

      expect(screen.getByText("Show Golden Box Shadow")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Display the golden box shadow around your profile card",
        ),
      ).toBeInTheDocument();
    });

    it("renders switches with correct initial states", () => {
      render(<ContributorForm {...defaultProps} />);

      const switches = screen.getAllByRole("switch");
      expect(switches).toHaveLength(2);

      // Both switches should be off initially
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked();
      });
    });
  });

  describe("Default Props and Data Handling", () => {
    it("handles missing contributor data gracefully", () => {
      const propsWithoutContributor = {
        portfolioData: {},
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithoutContributor} />);

      const switches = screen.getAllByRole("switch");
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked();
      });
    });

    it("handles null portfolio data gracefully", () => {
      const propsWithNullData = {
        portfolioData: null,
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithNullData} />);

      const switches = screen.getAllByRole("switch");
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked();
      });
    });

    it("handles undefined portfolio data gracefully", () => {
      const propsWithUndefinedData = {
        portfolioData: undefined,
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithUndefinedData} />);

      const switches = screen.getAllByRole("switch");
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked();
      });
    });

    it("displays correct initial values when contributor data exists", () => {
      const propsWithData = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            showGoldenBoxShadow: true,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithData} />);

      const switches = screen.getAllByRole("switch");
      switches.forEach((switchElement) => {
        expect(switchElement).toBeChecked();
      });
    });
  });

  describe("Switch Component Interactions", () => {
    it("calls onContributorChange when enableContributorStatus switch is toggled on", () => {
      render(<ContributorForm {...defaultProps} />);

      const enableContributorSwitch = screen.getAllByRole("switch")[0];
      fireEvent.click(enableContributorSwitch);

      expect(mockOnContributorChange).toHaveBeenCalledTimes(2);
      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "showGoldenBoxShadow",
        true,
      );
      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "enableContributorStatus",
        true,
      );
    });

    it("calls onContributorChange when enableContributorStatus switch is toggled off", () => {
      const propsWithEnabledStatus = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            showGoldenBoxShadow: true,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithEnabledStatus} />);

      const enableContributorSwitch = screen.getAllByRole("switch")[0];
      fireEvent.click(enableContributorSwitch);

      expect(mockOnContributorChange).toHaveBeenCalledTimes(2);
      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "showGoldenBoxShadow",
        false,
      );
      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "enableContributorStatus",
        false,
      );
    });

    it("calls onContributorChange when showGoldenBoxShadow switch is toggled", () => {
      const propsWithEnabledStatus = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            showGoldenBoxShadow: false,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithEnabledStatus} />);

      const goldenBoxShadowSwitch = screen.getAllByRole("switch")[1];
      fireEvent.click(goldenBoxShadowSwitch);

      expect(mockOnContributorChange).toHaveBeenCalledTimes(1);
      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "showGoldenBoxShadow",
        true,
      );
    });
  });

  describe("Contributor Status Logic", () => {
    it("disables golden box shadow switch when contributor status is disabled", () => {
      render(<ContributorForm {...defaultProps} />);

      const switches = screen.getAllByRole("switch");
      const goldenBoxShadowSwitch = switches[1];

      expect(goldenBoxShadowSwitch).toBeDisabled();
    });

    it("enables golden box shadow switch when contributor status is enabled", () => {
      const propsWithEnabledStatus = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            showGoldenBoxShadow: false,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithEnabledStatus} />);

      const switches = screen.getAllByRole("switch");
      const goldenBoxShadowSwitch = switches[1];

      expect(goldenBoxShadowSwitch).toBeEnabled();
    });

    it("shows golden box shadow switch as selected only when both conditions are met", () => {
      const propsWithBothEnabled = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            showGoldenBoxShadow: true,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithBothEnabled} />);

      const switches = screen.getAllByRole("switch");
      const goldenBoxShadowSwitch = switches[1];

      expect(goldenBoxShadowSwitch).toBeChecked();
    });

    it("shows golden box shadow switch as unselected when contributor status is disabled", () => {
      const propsWithOnlyGoldenEnabled = {
        portfolioData: {
          contributor: {
            enableContributorStatus: false,
            showGoldenBoxShadow: true,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithOnlyGoldenEnabled} />);

      const switches = screen.getAllByRole("switch");
      const goldenBoxShadowSwitch = switches[1];

      expect(goldenBoxShadowSwitch).not.toBeChecked();
    });

    it("automatically enables golden box shadow when contributor status is enabled", () => {
      render(<ContributorForm {...defaultProps} />);

      const enableContributorSwitch = screen.getAllByRole("switch")[0];
      fireEvent.click(enableContributorSwitch);

      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "showGoldenBoxShadow",
        true,
      );
    });

    it("automatically disables golden box shadow when contributor status is disabled", () => {
      const propsWithBothEnabled = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            showGoldenBoxShadow: true,
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithBothEnabled} />);

      const enableContributorSwitch = screen.getAllByRole("switch")[0];
      fireEvent.click(enableContributorSwitch);

      expect(mockOnContributorChange).toHaveBeenCalledWith(
        "showGoldenBoxShadow",
        false,
      );
    });
  });

  describe("Edge Cases and Error Conditions", () => {
    it("handles missing onContributorChange gracefully", () => {
      const propsWithoutCallback = {
        portfolioData: defaultProps.portfolioData,
        onContributorChange: undefined as any,
      };

      expect(() => {
        render(<ContributorForm {...propsWithoutCallback} />);
      }).not.toThrow();
    });

    it("handles partial contributor data", () => {
      const propsWithPartialData = {
        portfolioData: {
          contributor: {
            enableContributorStatus: true,
            // showGoldenBoxShadow is missing
          },
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithPartialData} />);

      const switches = screen.getAllByRole("switch");
      expect(switches[0]).toBeChecked();
      expect(switches[1]).not.toBeChecked();
    });

    it("renders correctly with empty contributor object", () => {
      const propsWithEmptyContributor = {
        portfolioData: {
          contributor: {},
        },
        onContributorChange: mockOnContributorChange,
      };

      render(<ContributorForm {...propsWithEmptyContributor} />);

      const switches = screen.getAllByRole("switch");
      switches.forEach((switchElement) => {
        expect(switchElement).not.toBeChecked();
      });
    });
  });

  describe("Component Structure and Accessibility", () => {
    it("has proper card structure", () => {
      render(<ContributorForm {...defaultProps} />);

      // Check that the card container exists with proper classes
      const cardElement = screen
        .getByText("Contributor Settings")
        .closest('[class*="mt-4"]');
      expect(cardElement).toBeInTheDocument();
    });

    it("has proper heading hierarchy", () => {
      render(<ContributorForm {...defaultProps} />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent("Contributor Settings");

      const subHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(subHeadings).toHaveLength(2);
      expect(subHeadings[0]).toHaveTextContent("Enable Contributor Status");
      expect(subHeadings[1]).toHaveTextContent("Show Golden Box Shadow");
    });

    it("has proper switch labels and descriptions", () => {
      render(<ContributorForm {...defaultProps} />);

      expect(
        screen.getByText("Show the contributor button on your profile"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Display the golden box shadow around your profile card",
        ),
      ).toBeInTheDocument();
    });

    it("maintains proper visual hierarchy with consistent spacing", () => {
      render(<ContributorForm {...defaultProps} />);

      const cardBody = screen.getByText(
        "These settings allow you to customize the contributor features of your portfolio.",
      ).parentElement;

      expect(cardBody).toHaveClass("gap-6");
    });
  });
});
