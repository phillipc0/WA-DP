import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Skills, getColorForSkill } from "@/components/portfolio/skills";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// Mock the usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(() => ({
    portfolioData: {
      skills: [
        { name: "UI/UX Design", level: "B1" },
        { name: "TypeScript", level: "C1" },
        { name: "React", level: "C2" },
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
      expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getAllByText("C1")[0]).toBeInTheDocument();
      expect(screen.getAllByText("B1")[0]).toBeInTheDocument();
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
