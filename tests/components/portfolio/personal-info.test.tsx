import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonalInfo } from "@/components/portfolio/personal-info";

// Mock the usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(() => ({
    portfolioData: {
      name: "John Doe",
      title: "Software Engineer",
      location: "San Francisco, CA",
      email: "john@example.com",
      bio: "Passionate software engineer with 5 years of experience.",
      avatar: "https://example.com/avatar.jpg",
      social: {
        github: "johndoe",
        twitter: "johndoe",
        linkedin: "johndoe",
        discord: "johndoe#1234",
        reddit: "johndoe",
      },
    },
  })),
}));

describe("PersonalInfo", () => {
  it("renders personal information correctly", () => {
    render(<PersonalInfo />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Passionate software engineer with 5 years of experience.",
      ),
    ).toBeInTheDocument();
  });

  it("renders avatar with correct alt text", () => {
    render(<PersonalInfo />);

    const avatar = screen.getByAltText("John Doe avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders all social media links", () => {
    render(<PersonalInfo />);

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Discord")).toBeInTheDocument();
    expect(screen.getByText("Reddit")).toBeInTheDocument();

    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/johndoe");

    const twitterLink = screen.getByRole("link", { name: /twitter/i });
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com/johndoe");

    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/johndoe",
    );

    const discordLink = screen.getByRole("link", { name: /discord/i });
    expect(discordLink).toHaveAttribute(
      "href",
      "https://discord.com/users/johndoe#1234",
    );

    const redditLink = screen.getByRole("link", { name: /reddit/i });
    expect(redditLink).toHaveAttribute(
      "href",
      "https://reddit.com/user/johndoe",
    );
  });

  it("all social links open in new tab", () => {
    render(<PersonalInfo />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });
});
