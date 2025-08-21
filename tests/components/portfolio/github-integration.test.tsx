import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GithubIntegration } from "@/components/portfolio/github-integration";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// Mock usePortfolioData hook
vi.mock("@/hooks/usePortfolioData", () => ({
  usePortfolioData: vi.fn(() => ({
    portfolioData: {
      social: {
        github: "testuser",
      },
    },
    isLoading: false,
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

  // Helper to mock successful fetch response
  const mockSuccessfulFetch = (data: any = mockRepos) => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });
  };

  // Helper to mock fetch failure
  const mockFailedFetch = (status = 404) => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status,
    });
  };

  // Helper to mock network error
  const mockNetworkError = (message = "Network error") => {
    (fetch as any).mockRejectedValueOnce(new Error(message));
  };

  // Helper to mock pending fetch (never resolves)
  const mockPendingFetch = () => {
    (fetch as any).mockImplementation(() => new Promise(() => {}));
  };

  // Helper to wait for sort dropdown to be ready
  const waitForSortDropdown = async () => {
    await waitFor(() => {
      expect(screen.getByText("Recently Updated")).toBeInTheDocument();
    });
  };

  // Helper to click dropdown and select option
  const selectSortOption = (currentOption: string, newOption: string) => {
    const sortButton = screen.getByRole("button", {
      name: new RegExp(currentOption),
    });
    fireEvent.click(sortButton);
    const option = screen.getByText(newOption);
    fireEvent.click(option);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
  });

  it("renders component header", () => {
    mockPendingFetch();

    render(<GithubIntegration />);

    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByText("GitHub Repositories")).toBeInTheDocument();
  });

  it("shows loading spinner initially", () => {
    mockPendingFetch();

    render(<GithubIntegration />);

    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("renders repositories successfully", async () => {
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();

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
    mockFailedFetch(404);

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load GitHub repositories"),
      ).toBeInTheDocument();
    });

    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("shows error message on network error", async () => {
    mockNetworkError();

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load GitHub repositories"),
      ).toBeInTheDocument();
    });

    expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("shows no repositories message when empty array returned", async () => {
    mockSuccessfulFetch([]);

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("No repositories found")).toBeInTheDocument();
    });
  });

  it("fetches repositories with correct API parameters", async () => {
    mockSuccessfulFetch();

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/testuser/repos?sort=updated&per_page=4",
      );
    });
  });

  it("renders homepage link when available", async () => {
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("react")).toBeInTheDocument();
    });

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("limits topics display to 6 and shows +N for additional topics", async () => {
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("Recently Updated")).toBeInTheDocument();
    });

    const sortButton = screen.getByRole("button", { name: /Recently Updated/ });
    expect(sortButton).toBeInTheDocument();
  });

  it("changes sort option when dropdown item is clicked", async () => {
    mockSuccessfulFetch();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: mockRepos }),
    });

    render(<GithubIntegration />);

    await waitForSortDropdown();
    selectSortOption("Recently Updated", "Most Stars");

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/search/repositories?q=user:testuser&sort=stars&order=desc&per_page=4",
      );
    });
  });

  it("uses cached data when switching back to previously loaded sort", async () => {
    mockSuccessfulFetch();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: mockRepos }),
    });

    render(<GithubIntegration />);

    await waitForSortDropdown();
    selectSortOption("Recently Updated", "Most Stars");

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    // Switch back to updated sorting - should use cached data
    selectSortOption("Most Stars", "Recently Updated");

    // Should not make additional fetch call
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("prevents event propagation on homepage link click", async () => {
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();

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
    mockSuccessfulFetch();
    mockNetworkError();

    render(<GithubIntegration />);

    await waitForSortDropdown();
    selectSortOption("Recently Updated", "Most Stars");

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

    mockSuccessfulFetch(reposWithLargeNumbers);

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("1.234")).toBeInTheDocument();
      expect(screen.getByText("5.678")).toBeInTheDocument();
    });
  });

  it("renders skeleton when portfolio is loading", () => {
    // Mock loading state
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: null,
      isLoading: true,
    });

    render(<GithubIntegration />);

    // Should render skeleton component
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders skeleton when portfolio data is null", () => {
    // Mock null portfolio data
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: null,
      isLoading: false,
    });

    render(<GithubIntegration />);

    // Should render skeleton component
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("handles missing social.github gracefully when portfolio data is available", () => {
    // Mock portfolio data without github username
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        social: {},
      } as any,
      isLoading: false,
    });

    render(<GithubIntegration />);

    // Should not attempt to fetch repositories
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not render view all repositories link when github username is missing", () => {
    // Mock portfolio data without github username
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        social: {},
      } as any,
      isLoading: false,
    });

    render(<GithubIntegration />);

    // Should not render the "View all repositories" link
    expect(screen.queryByText("View all repositories")).not.toBeInTheDocument();
  });

  it("does not render language indicator when language is null", async () => {
    // Reset the mock to return the default portfolio data first
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        social: {
          github: "testuser",
        },
      },
      isLoading: false,
    });

    const reposWithoutLanguage = [
      {
        ...mockRepos[0],
        language: null,
        homepage: undefined,
      },
    ];

    mockSuccessfulFetch(reposWithoutLanguage);

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    // Should not render language indicator
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("handles empty topics array correctly", async () => {
    // Reset the mock to return the default portfolio data first
    vi.mocked(usePortfolioData).mockReturnValue({
      portfolioData: {
        social: {
          github: "testuser",
        },
      },
      isLoading: false,
    });

    const reposWithEmptyTopics = [
      {
        ...mockRepos[0],
        topics: [],
      },
    ];

    mockSuccessfulFetch(reposWithEmptyTopics);

    render(<GithubIntegration />);

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
    });

    // Should not render any topic chips
    expect(screen.queryByText("react")).not.toBeInTheDocument();
    expect(screen.queryByText("typescript")).not.toBeInTheDocument();
  });
});
