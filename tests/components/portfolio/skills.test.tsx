import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Skills, getColorForSkill } from "@/components/portfolio/skills";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// Mock the usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(() => ({
    portfolioData: {
      skills: [
        { name: "JavaScript", level: 85 },
        { name: "TypeScript", level: 90 },
        { name: "React", level: 80 },
      ],
    },
    isLoading: false,
  })),
}));

describe("Skills", () => {
  describe("Skills component", () => {
    it("renders skills correctly", () => {
      render(<Skills />);

      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("90%")).toBeInTheDocument();
      expect(screen.getByText("80%")).toBeInTheDocument();
    });

    it("renders progress bars with correct aria-labels", () => {
      render(<Skills />);

      expect(
        screen.getByLabelText("JavaScript skill level"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("TypeScript skill level"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("React skill level")).toBeInTheDocument();
    });
  });

  describe("getColorForSkill", () => {
    const expected = ["primary", "secondary", "success", "warning", "danger"];

    it("returns the colors cyclically correctly", () => {
      for (let i = 0; i < 12; i++) {
        const color = getColorForSkill(i);

        expect(color).toBe(expected[i % expected.length]);
      }
    });

    it("returns correct type", () => {
      const color = getColorForSkill(0);
      expect(typeof color).toBe("string");
      expect(expected).toContain(color);
    });
  });

  describe("Loading states", () => {
    it("renders skeleton when portfolio is loading", () => {
      vi.mocked(usePortfolioData).mockReturnValue({
        portfolioData: null,
        isLoading: true,
      });

      render(<Skills />);

      // Should render skeleton component
      expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("renders skeleton when portfolio data is null", () => {
      vi.mocked(usePortfolioData).mockReturnValue({
        portfolioData: null,
        isLoading: false,
      });

      render(<Skills />);

      // Should render skeleton component
      expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });
  });
});
