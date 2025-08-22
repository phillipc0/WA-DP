import type { SortOption } from "@/hooks/useGithubRepositories";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

import { RepositoryCard, type Repository } from "./repository-card";

import { GithubIcon } from "@/components/icons";
import { GithubIntegrationSkeleton } from "@/components/ui/skeleton";

interface RepositoryContainerProps {
  title: string;
  repositories: Repository[];
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  loading: boolean;
  error: string | null;
  portfolioLoading: boolean;
  hasGithubUsername: boolean;
  githubUsername?: string;
  showSorting?: boolean;
  emptyMessage?: string;
}

/**
 * Container component for displaying repositories with sorting and loading states
 * @param props - Component props
 * @param props.title - The title to display in the header
 * @param props.repositories - Array of repositories to display
 * @param props.sortBy - Current sort option
 * @param props.setSortBy - Function to change sort option
 * @param props.loading - Loading state
 * @param props.error - Error message if any
 * @param props.portfolioLoading - Portfolio loading state
 * @param props.hasGithubUsername - Whether user has GitHub username
 * @param props.githubUsername - GitHub username for footer link
 * @param props.showSorting - Whether to show sorting dropdown
 * @param props.emptyMessage - Message to show when no repositories found
 * @returns Repository container component
 */
export function RepositoryContainer({
  title,
  repositories,
  sortBy,
  setSortBy,
  loading,
  error,
  portfolioLoading,
  hasGithubUsername,
  githubUsername,
  showSorting = true,
  emptyMessage = "No repositories found",
}: RepositoryContainerProps) {
  if (portfolioLoading) {
    return <GithubIntegrationSkeleton />;
  }

  if (!hasGithubUsername) {
    return null;
  }

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
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        {showSorting && (
          <div className="flex items-center flex-wrap gap-2 sm:gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="min-w-[140px] justify-between ml-auto"
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
        )}
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : repositories.length === 0 ? (
          <div>{emptyMessage}</div>
        ) : (
          <div className="grid gap-4">
            {repositories.map((repo, index) => (
              <RepositoryCard key={repo.id} index={index} repo={repo} />
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="border-t border-default-200/50 bg-default-50/50">
        {githubUsername && (
          <Link
            isExternal
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors duration-200"
            href={`https://github.com/${githubUsername}`}
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
        )}
      </CardFooter>
    </Card>
  );
}
