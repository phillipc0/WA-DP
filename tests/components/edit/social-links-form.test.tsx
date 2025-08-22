import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SocialLinksForm } from "@/components/portfolioEditor/social-links-form";

describe("SocialLinksForm", () => {
  const mockPortfolioData = {
    social: {
      github: "johndoe_github",
      twitter: "johndoe_twitter",
      twitterPlatform: "twitter",
      linkedin: "johndoe_linkedin",
      discord: "johndoe#1234",
      reddit: "johndoe_reddit",
      youtube: "johndoe_youtube",
      steam: "76561197984767093",
    },
  };

  const defaultProps = {
    portfolioData: mockPortfolioData,
    onSocialChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all social media input fields", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByLabelText("GitHub Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter Username")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Discord User-ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Reddit Username")).toBeInTheDocument();
    expect(screen.getByLabelText("YouTube Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Steam ID")).toBeInTheDocument();
  });

  it("displays correct values in input fields", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByLabelText("GitHub Username")).toHaveValue(
      "johndoe_github",
    );
    expect(screen.getByLabelText("Discord User-ID")).toHaveValue(
      "johndoe#1234",
    );
    expect(screen.getByLabelText("Steam ID")).toHaveValue(
      "76561197984767093",
    );
  });

  it("displays correct URL prefixes", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByText("github.com/")).toBeInTheDocument();
    expect(screen.getByText("twitter.com/")).toBeInTheDocument();
    expect(screen.getByText("linkedin.com/in/")).toBeInTheDocument();
    expect(screen.getByText("discord.com/users/")).toBeInTheDocument();
    expect(screen.getByText("reddit.com/user/")).toBeInTheDocument();
    expect(screen.getByText("youtube.com/@")).toBeInTheDocument();
    expect(
      screen.getByText("steamcommunity.com/profiles/")
    ).toBeInTheDocument();
  });

  it("calls onSocialChange when GitHub input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const githubInput = screen.getByLabelText("GitHub Username");
    fireEvent.change(githubInput, {
      target: { name: "github", value: "newgithub" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("github");
  });

  it("calls onSocialChange when Twitter input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const twitterInput = screen.getByLabelText("Twitter Username");
    fireEvent.change(twitterInput, {
      target: { name: "twitter", value: "newtwitter" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("twitter");
  });

  it("calls onSocialChange when LinkedIn input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const linkedinInput = screen.getByLabelText("LinkedIn Username");
    fireEvent.change(linkedinInput, {
      target: { name: "linkedin", value: "newlinkedin" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("linkedin");
  });

  it("calls onSocialChange when Discord input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const discordInput = screen.getByLabelText("Discord User-ID");
    fireEvent.change(discordInput, {
      target: { name: "discord", value: "newdiscord#5678" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("discord");
  });

  it("calls onSocialChange when Reddit input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const redditInput = screen.getByLabelText("Reddit Username");
    fireEvent.change(redditInput, {
      target: { name: "reddit", value: "newreddit" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("reddit");
  });

  it("renders card header correctly", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByText("Social Media Profiles")).toBeInTheDocument();
  });

  it("has correct placeholder texts", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Your GitHub username"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your Twitter username"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your LinkedIn username"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("000000000000000000"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your Reddit username"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your YouTube username"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("76561197984767093"),
    ).toBeInTheDocument();
  });

  it("handles empty social data gracefully", () => {
    const emptyPortfolioData = {
      social: {
        github: "",
        twitter: "",
        linkedin: "",
        discord: "",
        reddit: "",
      },
    };

    render(
      <SocialLinksForm
        portfolioData={emptyPortfolioData}
        onSocialChange={vi.fn()}
      />,
    );

    // All inputs should be empty but present
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveValue("");
    });
  });

  it("renders all inputs with proper names", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByLabelText("GitHub Username")).toHaveAttribute(
      "name",
      "github",
    );
    expect(screen.getByLabelText("Twitter Username")).toHaveAttribute(
      "name",
      "twitter",
    );
    expect(screen.getByLabelText("LinkedIn Username")).toHaveAttribute(
      "name",
      "linkedin",
    );
    expect(screen.getByLabelText("Discord User-ID")).toHaveAttribute(
      "name",
      "discord",
    );
    expect(screen.getByLabelText("Reddit Username")).toHaveAttribute(
      "name",
      "reddit",
    );
  });

  it("renders inputs with proper focus capability", () => {
    render(<SocialLinksForm {...defaultProps} />);

    const githubInput = screen.getByLabelText("GitHub Username");
    expect(githubInput).toBeInTheDocument();
    expect(githubInput.tagName).toBe("INPUT");

    const steamInput = screen.getByLabelText("Steam ID");
    expect(steamInput).toBeInTheDocument();
    expect(steamInput.tagName).toBe("INPUT");
  });

  it("calls onSocialChange when YouTube input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const youtubeInput = screen.getByLabelText("YouTube Username");
    fireEvent.change(youtubeInput, {
      target: { name: "youtube", value: "newyoutube" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("youtube");
  });

  it("renders YouTube input with correct attributes", () => {
    render(<SocialLinksForm {...defaultProps} />);

    const youtubeInput = screen.getByLabelText("YouTube Username");
    expect(youtubeInput).toHaveAttribute("name", "youtube");
    expect(youtubeInput).toHaveValue("johndoe_youtube");
  });

  it("renders Twitter/X platform selector", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByLabelText("Platform")).toBeInTheDocument();
    const twitterOptions = screen.getAllByText("Twitter");
    expect(twitterOptions.length).toBeGreaterThan(0);
  });

  it("has onSocialSelectChange prop for platform switching", () => {
    const onSocialSelectChange = vi.fn();
    render(
      <SocialLinksForm
        {...defaultProps}
        onSocialSelectChange={onSocialSelectChange}
      />,
    );

    // Test that the component renders with the callback prop
    expect(screen.getByLabelText("Platform")).toBeInTheDocument();
    expect(onSocialSelectChange).toBeDefined();
  });

  it("displays X platform URL prefix when twitterPlatform is x", () => {
    const xPortfolioData = {
      social: {
        ...mockPortfolioData.social,
        twitterPlatform: "x",
      },
    };

    render(
      <SocialLinksForm
        portfolioData={xPortfolioData}
        onSocialChange={vi.fn()}
      />,
    );

    expect(screen.getByText("x.com/")).toBeInTheDocument();
    expect(screen.getByLabelText("X Username")).toBeInTheDocument();
  });

  it("displays Twitter platform URL prefix when twitterPlatform is twitter", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByText("twitter.com/")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter Username")).toBeInTheDocument();
  });

  it("updates placeholder text based on platform selection", () => {
    const xPortfolioData = {
      social: {
        ...mockPortfolioData.social,
        twitterPlatform: "x",
      },
    };

    render(
      <SocialLinksForm
        portfolioData={xPortfolioData}
        onSocialChange={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Your X username")).toBeInTheDocument();
  });

  it("handles empty YouTube data gracefully", () => {
    const emptyPortfolioData = {
      social: {
        github: "",
        twitter: "",
        twitterPlatform: "twitter",
        linkedin: "",
        discord: "",
        reddit: "",
        youtube: "",
      },
    };

    render(
      <SocialLinksForm
        portfolioData={emptyPortfolioData}
        onSocialChange={vi.fn()}
      />,
    );

    const youtubeInput = screen.getByLabelText("YouTube Username");
    expect(youtubeInput).toHaveValue("");
  });

  // Added tests for Steam (moved inside describe to access defaultProps)
  it("calls onSocialChange when Steam ID input changes", () => {
    const onSocialChange = vi.fn();
    render(
      <SocialLinksForm {...defaultProps} onSocialChange={onSocialChange} />,
    );

    const steamInput = screen.getByLabelText("Steam ID");
    fireEvent.change(steamInput, {
      target: { name: "steam", value: "76561198000000000" },
    });

    expect(onSocialChange).toHaveBeenCalled();
    const call = onSocialChange.mock.calls[0][0];
    expect(call.target.name).toBe("steam");
  });
});
