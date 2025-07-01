import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

import { GithubIcon } from "@/components/icons";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { getLanguageColor } from "@/lib/language-colors";

const REPO_PER_PAGE = 4;

type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
};

type SortOption = "updated" | "stars";

interface GithubIntegrationProps {
  refreshTrigger?: number;
}

export function GithubIntegration({ refreshTrigger }: GithubIntegrationProps) {
  const { portfolioData, isLoading: portfolioLoading } =
    usePortfolioData(refreshTrigger);
  const [reposCache, setReposCache] = useState<
    Record<SortOption, Repository[]>
  >({
    updated: [],
    stars: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if a repository is a contributor repository
  const isContributor = (repo: Repository) =>
    repo.full_name === "phillipc0/WA-DP";

  const fetchReposForSort = async (
    githubUsername: string,
    sort: SortOption,
  ) => {
    try {
      let response;

      if (sort === "stars") {
        // The users API does not support sorting by stars
        response = await fetch(
          `https://api.github.com/search/repositories?q=user:${githubUsername}&sort=stars&order=desc&per_page=${REPO_PER_PAGE}`,
        );
      } else {
        response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${REPO_PER_PAGE}`,
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();

      return sort === "stars" ? data.items : data;
    } catch (err) {
      console.error(`Error fetching ${sort} repos:`, err);
      throw err;
    }
  };

  useEffect(() => {
    const initializeRepos = async () => {
      const githubUsername = portfolioData.social.github;

      if (portfolioLoading || !githubUsername) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const repos = await fetchReposForSort(githubUsername, "updated");

        setReposCache((prev) => ({
          ...prev,
          updated: repos,
        }));

        setLoading(false);
      } catch (err) {
        setError("Failed to load GitHub repositories");
        setLoading(false);
        console.error(err);
      }
    };

    initializeRepos().catch(console.error);
  }, [portfolioData.social.github, portfolioLoading]);

  useEffect(() => {
    const loadReposForSort = async () => {
      const githubUsername = portfolioData.social.github;

      if (!githubUsername) {
        return;
      }

      if (reposCache[sortBy].length > 0) {
        return;
      }

      if (sortBy === "updated" && reposCache.updated.length === 0) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const repos = await fetchReposForSort(githubUsername, sortBy);

        setReposCache((prev) => ({
          ...prev,
          [sortBy]: repos,
        }));

        setLoading(false);
      } catch (err) {
        setError("Failed to load GitHub repositories");
        setLoading(false);
        console.error(err);
      }
    };

    loadReposForSort().catch(console.error);
  }, [sortBy, portfolioData.social.github]);

  return (
    <Card className="w-full border border-default-200/50 shadow-sm">
      <CardHeader className="flex gap-3 items-center bg-gradient-to-r from-default-50 to-default-100/50 border-b border-default-200/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-default-900 dark:bg-default-100">
          <GithubIcon
            className="text-default-100 dark:text-default-900"
            size={20}
          />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-bold text-foreground">
            GitHub Repositories
          </h2>
        </div>
        <div className="ml-auto">
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="min-w-[140px] justify-between"
                size="sm"
                variant="bordered"
              >
                {sortBy === "updated" ? "Recently Updated" : "Most Stars"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort repositories"
              selectedKeys={[sortBy]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const keyArray = Array.from(keys);
                if (keyArray.length > 0) {
                  const key = keyArray[0] as SortOption;
                  if (key !== sortBy) {
                    setSortBy(key);
                  }
                }
              }}
            >
              <DropdownItem key="updated">Recently Updated</DropdownItem>
              <DropdownItem key="stars">Most Stars</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : reposCache[sortBy].length === 0 ? (
          <div>No repositories found</div>
        ) : (
          <div className="grid gap-4">
            {reposCache[sortBy].map((repo, index) => (
              <Card
                key={repo.id}
                isExternal
                isHoverable
                isPressable
                as={Link}
                className={`group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border ${isContributor(repo) ? "border-yellow-400" : "border-default-200/50"} hover:border-primary/30 repo-card-enter`}
                href={repo.html_url}
                style={{
                  animationDelay: `${index * 100}ms`,
                  ...(isContributor(repo)
                    ? {
                        boxShadow: "0 0 15px 5px rgba(245, 158, 11, 0.5)",
                      }
                    : {}),
                }}
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-default-600 mt-1 line-clamp-2">
                        {repo.description || "No description available"}
                      </p>
                      {repo.homepage && (
                        <Link
                          isExternal
                          className="text-xs text-primary hover:text-primary-600 transition-colors duration-200 mt-1 inline-block"
                          href={repo.homepage}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗 {repo.homepage}
                        </Link>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      {repo.full_name === "phillipc0/WA-DP" && (
                        <Button
                          className="text-xs font-bold text-yellow-500 mb-2"
                          size="sm"
                          style={{ borderColor: "#F59E0B" }}
                          variant="bordered"
                        >
                          Contributor
                        </Button>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {repo.topics.slice(0, 6).map((topic) => (
                          <Chip
                            key={topic}
                            className="h-5 text-xs"
                            color="primary"
                            size="sm"
                            variant="flat"
                          >
                            {topic}
                          </Chip>
                        ))}
                        {repo.topics.length > 6 && (
                          <Chip
                            className="h-5 text-xs"
                            color="default"
                            size="sm"
                            variant="flat"
                          >
                            +{repo.topics.length - 6}
                          </Chip>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getLanguageColor(repo.language),
                            }}
                          />
                          <span className="text-xs text-default-600 font-medium">
                            {repo.language}
                          </span>
                        </div>
                      )}

                      <Link
                        isExternal
                        className="flex items-center gap-1 text-xs text-default-500 hover:text-primary transition-colors duration-200"
                        href={`${repo.html_url}/stargazers`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>
                          {repo.stargazers_count.toLocaleString("de-DE")}
                        </span>
                      </Link>

                      <Link
                        isExternal
                        className="flex items-center gap-1 text-xs text-default-500 hover:text-primary transition-colors duration-200"
                        href={`${repo.html_url}/network/members`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z"
                            fillRule="evenodd"
                          />
                        </svg>
                        <span>{repo.forks_count.toLocaleString("de-DE")}</span>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="border-t border-default-200/50 bg-default-50/50">
        <Link
          isExternal
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors duration-200"
          href={`https://github.com/${portfolioData.social.github}`}
        >
          <span>View all repositories</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}
