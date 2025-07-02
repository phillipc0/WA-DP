import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SocialLinksForm } from "@/components/portfolioEditor/social-links-form";

describe("SocialLinksForm", () => {
  const mockPortfolioData = {
    social: {
      github: "johndoe_github",
      twitter: "johndoe_twitter",
      linkedin: "johndoe_linkedin",
      discord: "johndoe#1234",
      reddit: "johndoe_reddit",
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
  });

  it("displays correct values in input fields", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByLabelText("GitHub Username")).toHaveValue(
      "johndoe_github",
    );
    expect(screen.getByLabelText("Discord User-ID")).toHaveValue(
      "johndoe#1234",
    );
  });

  it("displays correct URL prefixes", () => {
    render(<SocialLinksForm {...defaultProps} />);

    expect(screen.getByText("github.com/")).toBeInTheDocument();
    expect(screen.getByText("twitter.com/")).toBeInTheDocument();
    expect(screen.getByText("linkedin.com/in/")).toBeInTheDocument();
    expect(screen.getByText("discord.com/users/")).toBeInTheDocument();
    expect(screen.getByText("reddit.com/user/")).toBeInTheDocument();
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
      screen.getByPlaceholderText("Your Discord 000000000000000000"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your Reddit username"),
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
  });
});
