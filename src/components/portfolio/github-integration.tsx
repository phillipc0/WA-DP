import { useGithubRepositories } from "@/hooks/useGithubRepositories";
import { RepositoryContainer } from "@/components/portfolio/shared/repository-container";

interface GithubIntegrationProps {
  refreshTrigger?: number;
}

/**
 * GitHub integration component that displays user repositories with sorting options
 * @param props - Component props
 * @param props.refreshTrigger - Optional trigger to refresh the portfolio data
 * @returns GitHub repositories display component
 */
export function GithubIntegration({ refreshTrigger }: GithubIntegrationProps) {
  const {
    repositories,
    sortBy,
    setSortBy,
    loading,
    error,
    portfolioData,
    portfolioLoading,
    hasGithubUsername,
  } = useGithubRepositories({ refreshTrigger });

  return (
    <RepositoryContainer
      emptyMessage="No repositories found"
      error={error}
      githubUsername={portfolioData?.social?.github}
      hasGithubUsername={hasGithubUsername}
      loading={loading}
      portfolioLoading={portfolioLoading}
      repositories={repositories}
      setSortBy={setSortBy}
      sortBy={sortBy}
      title="GitHub Repositories"
    />
  );
}
