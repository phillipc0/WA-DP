import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalInfo } from "@/components/portfolio/personal-info";

// Mock the usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(),
}));

// Mock the contributor utility
vi.mock("@/utils/contributor", () => ({
  isContributor: vi.fn(),
}));

describe("PersonalInfo", () => {
  beforeEach(async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");
    const { isContributor } = await import("@/utils/contributor");

    vi.mocked(usePortfolioData).mockReturnValue({
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
          twitterPlatform: "twitter",
          linkedin: "johndoe",
          discord: "johndoe#1234",
          reddit: "johndoe",
          youtube: "johndoe",
          steam: "76561197984767093",
        },
        contributor: {
          enableContributorStatus: false,
          showGoldenBoxShadow: false,
        },
      },
      isLoading: false,
    });

    vi.mocked(isContributor).mockReturnValue(false);
  });

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

  it("renders fallback avatar SVG when avatar URL is empty", async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");

    // Override for this test case only
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        name: "John Doe",
        title: "Software Engineer",
        location: "San Francisco, CA",
        email: "john@example.com",
        bio: "Passionate software engineer with 5 years of experience.",
        avatar: "", // empty avatar triggers fallback
        social: {
          github: "johndoe",
          twitter: "johndoe",
          twitterPlatform: "twitter",
          linkedin: "johndoe",
          discord: "johndoe#1234",
          reddit: "johndoe",
          youtube: "johndoe",
          steam: "76561197984767093",
        },
        contributor: {
          enableContributorStatus: false,
          showGoldenBoxShadow: false,
        },
      },
      isLoading: false,
    });

    render(<PersonalInfo />);

    // Should not find <img> by alt when no avatar URL
    expect(screen.queryByAltText("John Doe avatar")).not.toBeInTheDocument();

    // Fallback is rendered with role img and proper aria-label
    const fallback = screen.getByRole("img", { name: "John Doe avatar" });
    expect(fallback).toBeInTheDocument();
  });

  it("renders all social media links", () => {
    render(<PersonalInfo />);

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Discord")).toBeInTheDocument();
    expect(screen.getByText("Reddit")).toBeInTheDocument();
    expect(screen.getByText("YouTube")).toBeInTheDocument();
    expect(screen.getByText("Steam")).toBeInTheDocument();

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

    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    expect(youtubeLink).toHaveAttribute("href", "https://youtube.com/@johndoe");

    const steamLink = screen.getByRole("link", { name: /steam/i });
    expect(steamLink).toHaveAttribute(
      "href",
      "https://steamcommunity.com/profiles/76561197984767093",
    );
  });

  it("all social links open in new tab", () => {
    render(<PersonalInfo />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders skeleton when portfolio is loading", async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");

    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: null,
      isLoading: true,
    });

    render(<PersonalInfo />);

    // Should render skeleton component
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders skeleton when portfolio data is null", async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");

    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: null,
      isLoading: false,
    });

    render(<PersonalInfo />);

    // Should render skeleton component
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("does not render location chip when location is empty", async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");

    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        name: "John Doe",
        title: "Software Engineer",
        location: "", // empty location
        email: "john@example.com",
        bio: "Passionate software engineer with 5 years of experience.",
        avatar: "https://example.com/avatar.jpg",
        social: {
          github: "johndoe",
          twitter: "johndoe",
          twitterPlatform: "twitter",
          linkedin: "johndoe",
          discord: "johndoe#1234",
          reddit: "johndoe",
          youtube: "johndoe",
          steam: "76561197984767093",
        },
        contributor: {
          enableContributorStatus: false,
          showGoldenBoxShadow: false,
        },
      },
      isLoading: false,
    });

    render(<PersonalInfo />);

    // Email should be rendered but location chip should not be there
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    // Test by looking for primary colored chips (location chips have primary color)
    const chips = document.querySelectorAll(".bg-primary");
    expect(chips).toHaveLength(0);
  });

  it("does not render email chip when email is empty", async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");

    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        name: "John Doe",
        title: "Software Engineer",
        location: "San Francisco, CA",
        email: "", // empty email
        bio: "Passionate software engineer with 5 years of experience.",
        avatar: "https://example.com/avatar.jpg",
        social: {
          github: "johndoe",
          twitter: "johndoe",
          twitterPlatform: "twitter",
          linkedin: "johndoe",
          discord: "johndoe#1234",
          reddit: "johndoe",
          youtube: "johndoe",
          steam: "76561197984767093",
        },
        contributor: {
          enableContributorStatus: false,
          showGoldenBoxShadow: false,
        },
      },
      isLoading: false,
    });

    render(<PersonalInfo />);

    // Location should be rendered but email chip should not be there
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
    // Test by looking for secondary colored chips (email chips have secondary color)
    const chips = document.querySelectorAll(".bg-secondary");
    expect(chips).toHaveLength(0);
  });

  it("does not render location or email chips when both are missing", async () => {
    const { usePortfolioData } = await import("@/hooks/usePortfolioData");

    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        name: "John Doe",
        title: "Software Engineer",
        location: null, // null location
        email: undefined, // undefined email
        bio: "Passionate software engineer with 5 years of experience.",
        avatar: "https://example.com/avatar.jpg",
        social: {
          github: "johndoe",
          twitter: "johndoe",
          twitterPlatform: "twitter",
          linkedin: "johndoe",
          discord: "johndoe#1234",
          reddit: "johndoe",
          youtube: "johndoe",
          steam: "76561197984767093",
        },
        contributor: {
          enableContributorStatus: false,
          showGoldenBoxShadow: false,
        },
      },
      isLoading: false,
    });

    render(<PersonalInfo />);

    // Neither chip type should exist when both values are missing
    const primaryChips = document.querySelectorAll(".bg-primary");
    const secondaryChips = document.querySelectorAll(".bg-secondary");

    expect(primaryChips).toHaveLength(0);
    expect(secondaryChips).toHaveLength(0);

    // Main content should still be there
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });
});
