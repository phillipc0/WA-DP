import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GithubIntegration } from "@/components/portfolio/github-integration";

// Mock usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(() => ({
    portfolioData: {
      social: {
        github: "testuser",
      },
    },
  })),
}));

// Mock GithubIcon
vi.mock("@/components/icons", () => ({
  GithubIcon: ({ size }: { size: number }) => (
    <div data-testid="github-icon" data-size={size} />
  ),
}));

// Mock fetch
global.fetch = vi.fn();

const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("GithubIntegration", () => {
  const mockRepos = [
    {
      id: 1,
      name: "repo1",
      description: "First repository",
      html_url: "https://github.com/testuser/repo1",
      stargazers_count: 10,
      forks_count: 5,
      language: "TypeScript",
    },
    {
      id: 2,
      name: "repo2",
      description: null,
      html_url: "https://github.com/testuser/repo2",
      stargazers_count: 3,
      forks_count: 1,
      language: "JavaScript",
    },
    {
      id: 3,
      name: "repo3",
      description: "Third repository",
      html_url: "https://github.com/testuser/repo3",
      stargazers_count: 0,
      forks_count: 0,
      language: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
  });

  it("renders component header", () => {
    (fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<GithubIntegration />);

    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByText("GitHub Repositories")).toBeInTheDocument();
  });

  it("shows loading spinner initially", () => {
    (fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<GithubIntegration />);

    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("renders repositories successfully", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    expect(screen.getByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("First repository")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("repo2")).toBeInTheDocument();
    expect(screen.getByText("No description available")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();

    expect(screen.getByText("repo3")).toBeInTheDocument();
    expect(screen.getByText("Third repository")).toBeInTheDocument();
  });

  it("renders repository links correctly", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    const repoLink = screen.getByRole("button", { 
      name: /repo1 First repository/i 
    });
    expect(repoLink).toHaveAttribute(
      "href",
      "https://github.com/testuser/repo1",
    );
    expect(repoLink).toHaveAttribute("target", "_blank");
  });

  it("renders view all repositories link", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("View all repositories")).toBeInTheDocument();
    });

    const viewAllLink = screen.getByRole("link", {
      name: "View all repositories",
    });
    expect(viewAllLink).toHaveAttribute("href", "https://github.com/testuser");
    expect(viewAllLink).toHaveAttribute("target", "_blank");
  });

  it("shows error message on failed fetch", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load GitHub repositories"),
      ).toBeInTheDocument();
    });

    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("shows error message on network error", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load GitHub repositories"),
      ).toBeInTheDocument();
    });

    expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("shows no repositories message when empty array returned", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("No repositories found")).toBeInTheDocument();
    });
  });

  it("fetches repositories with correct API parameters", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/testuser/repos?sort=updated&per_page=4",
      );
    });
  });
});
