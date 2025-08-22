import type { Repository } from "@/components/portfolio/shared/repository-card";

import { useEffect, useState } from "react";

import { usePortfolioData } from "@/hooks/usePortfolioData";

export type SortOption = "updated" | "stars";

const REPO_PER_PAGE = 4;

interface UseGithubRepositoriesProps {
  refreshTrigger?: number;
}

/**
 * Custom hook for fetching and managing GitHub repositories
 * @param props - Hook props
 * @param props.refreshTrigger - Optional trigger to refresh the portfolio data
 * @returns Repository data and management functions
 */
export function useGithubRepositories({
  refreshTrigger,
}: UseGithubRepositoriesProps = {}) {
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

  const fetchReposForSort = async (
    githubUsername: string,
    sort: SortOption,
  ): Promise<Repository[]> => {
    try {
      let response;

      if (sort === "stars") {
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
      if (portfolioLoading || !portfolioData) {
        setLoading(false);
        return;
      }

      const githubUsername = portfolioData.social.github;

      if (!githubUsername) {
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
  }, [portfolioData?.social?.github, portfolioLoading]);

  useEffect(() => {
    const loadReposForSort = async () => {
      if (!portfolioData) {
        return;
      }

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
  }, [sortBy, portfolioData?.social?.github]);

  return {
    repositories: reposCache[sortBy] || [],
    sortBy,
    setSortBy,
    loading,
    error,
    portfolioData,
    portfolioLoading,
    hasGithubUsername: !!portfolioData?.social?.github,
  };
}
