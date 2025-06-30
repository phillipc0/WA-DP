import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
      homepage: "https://repo1.com",
      stargazers_count: 10,
      forks_count: 5,
      language: "TypeScript",
      topics: ["react", "typescript", "frontend"],
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "repo2",
      description: null,
      html_url: "https://github.com/testuser/repo2",
      stargazers_count: 3,
      forks_count: 1,
      language: "JavaScript",
      topics: [],
      updated_at: "2024-01-02T00:00:00Z",
    },
    {
      id: 3,
      name: "repo3",
      description: "Third repository",
      html_url: "https://github.com/testuser/repo3",
      stargazers_count: 0,
      forks_count: 0,
      language: null,
      topics: [
        "topic1",
        "topic2",
        "topic3",
        "topic4",
        "topic5",
        "topic6",
        "topic7",
        "topic8",
      ],
      updated_at: "2024-01-03T00:00:00Z",
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
      name: /repo1 First repository/i,
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

  it("renders homepage link when available", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("🔗 https://repo1.com")).toBeInTheDocument();
    });

    const homepageLink = screen.getByRole("link", {
      name: /https:\/\/repo1\.com/,
    });
    expect(homepageLink).toHaveAttribute("href", "https://repo1.com");
    expect(homepageLink).toHaveAttribute("target", "_blank");
  });

  it("renders repository topics correctly", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("react")).toBeInTheDocument();
    });

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("limits topics display to 6 and shows +N for additional topics", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("topic1")).toBeInTheDocument();
    });

    // Should show first 6 topics
    expect(screen.getByText("topic1")).toBeInTheDocument();
    expect(screen.getByText("topic6")).toBeInTheDocument();

    // Should show +2 for the remaining topics
    expect(screen.getByText("+2")).toBeInTheDocument();

    // Should not show topics beyond the 6th
    expect(screen.queryByText("topic7")).not.toBeInTheDocument();
    expect(screen.queryByText("topic8")).not.toBeInTheDocument();
  });

  it("renders stargazers and forks links correctly", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    const stargazersLinks = screen.getAllByRole("link", { name: /10/ });
    expect(stargazersLinks[0]).toHaveAttribute(
      "href",
      "https://github.com/testuser/repo1/stargazers",
    );

    const forksLinks = screen.getAllByRole("link", { name: /5/ });
    expect(forksLinks[0]).toHaveAttribute(
      "href",
      "https://github.com/testuser/repo1/network/members",
    );
  });

  it("renders sort dropdown with correct options", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("Recently Updated")).toBeInTheDocument();
    });

    const sortButton = screen.getByRole("button", { name: /Recently Updated/ });
    expect(sortButton).toBeInTheDocument();
  });

  it("changes sort option when dropdown item is clicked", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRepos),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: mockRepos }),
      });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("Recently Updated")).toBeInTheDocument();
    });

    // Click the dropdown button
    const sortButton = screen.getByRole("button", { name: /Recently Updated/ });
    fireEvent.click(sortButton);

    // Click on "Most Stars" option
    const mostStarsOption = screen.getByText("Most Stars");
    fireEvent.click(mostStarsOption);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/search/repositories?q=user:testuser&sort=stars&order=desc&per_page=4",
      );
    });
  });

  it("uses cached data when switching back to previously loaded sort", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRepos),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: mockRepos }),
      });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("Recently Updated")).toBeInTheDocument();
    });

    // Switch to stars sorting
    const sortButton = screen.getByRole("button", { name: /Recently Updated/ });
    fireEvent.click(sortButton);
    const mostStarsOption = screen.getByText("Most Stars");
    fireEvent.click(mostStarsOption);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    // Switch back to updated sorting - should use cached data
    fireEvent.click(screen.getByRole("button", { name: /Most Stars/ }));
    fireEvent.click(screen.getByText("Recently Updated"));

    // Should not make additional fetch call
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("prevents event propagation on homepage link click", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("🔗 https://repo1.com")).toBeInTheDocument();
    });

    const homepageLink = screen.getByRole("link", {
      name: /https:\/\/repo1\.com/,
    });
    const stopPropagationSpy = vi.fn();

    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "stopPropagation", {
      value: stopPropagationSpy,
    });

    fireEvent(homepageLink, clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("prevents event propagation on stargazers and forks link clicks", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    const stargazersLink = screen.getAllByRole("link", { name: /10/ })[0];
    const stopPropagationSpy = vi.fn();

    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "stopPropagation", {
      value: stopPropagationSpy,
    });

    fireEvent(stargazersLink, clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("handles fetch error in sort switching", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRepos),
      })
      .mockRejectedValueOnce(new Error("Network error"));

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("Recently Updated")).toBeInTheDocument();
    });

    // Switch to stars sorting which will fail
    const sortButton = screen.getByRole("button", { name: /Recently Updated/ });
    fireEvent.click(sortButton);
    const mostStarsOption = screen.getByText("Most Stars");
    fireEvent.click(mostStarsOption);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load GitHub repositories"),
      ).toBeInTheDocument();
    });

    expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("formats large numbers correctly in stargazers and forks count", async () => {
    const reposWithLargeNumbers = [
      {
        ...mockRepos[0],
        stargazers_count: 1234,
        forks_count: 5678,
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(reposWithLargeNumbers),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("1,234")).toBeInTheDocument();
    });

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("5,678")).toBeInTheDocument();
  });

  it("does not render language indicator when language is null", async () => {
    const reposWithoutLanguage = [
      {
        ...mockRepos[0],
        language: null,
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(reposWithoutLanguage),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    // Should not render language indicator
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("handles empty topics array correctly", async () => {
    const reposWithEmptyTopics = [
      {
        ...mockRepos[0],
        topics: [],
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(reposWithEmptyTopics),
    });

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    // Should not render any topic chips
    expect(screen.queryByText("react")).not.toBeInTheDocument();
    expect(screen.queryByText("typescript")).not.toBeInTheDocument();
  });
});
