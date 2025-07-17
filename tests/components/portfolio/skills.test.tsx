import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getColorForSkill, Skills } from "@/components/portfolio/skills";

// Mock the usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(() => ({
    portfolioData: {
      skills: [
        { name: "UI/UX Design", level: "Intermediate" },
        { name: "TypeScript", level: "Expert" },
        { name: "React", level: "Master" },
      ],
    },
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
      expect(screen.getAllByText("Expert")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Intermediate")[0]).toBeInTheDocument();
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
});
