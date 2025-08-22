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

import { GithubIcon } from "@/components/icons";
import { GithubIntegrationSkeleton } from "@/components/ui/skeleton";
import { CustomProject } from "@/types";
import { useGithubRepositories } from "@/hooks/useGithubRepositories";
import {
  RepositoryCard,
  type Repository,
} from "@/components/portfolio/shared/repository-card";
import { CustomProjectCard } from "@/components/portfolio/shared/custom-project-card";

interface ProjectsProps {
  refreshTrigger?: number;
}

interface ProjectCardProps {
  project: Repository | CustomProject;
  index: number;
  isCustom: boolean;
}

/**
 * Renders a project card for either GitHub repositories or custom projects
 * @param props - Component props
 * @param props.project - The project data (Repository or CustomProject)
 * @param props.index - Index for animation delay
 * @param props.isCustom - Whether this is a custom project
 * @returns Project card component
 */
function ProjectCard({ project, index, isCustom }: ProjectCardProps) {
  if (isCustom) {
    return (
      <CustomProjectCard index={index} project={project as CustomProject} />
    );
  }
  return <RepositoryCard index={index} repo={project as Repository} />;
}

/**
 * Intersperses custom projects within a list of repositories.
 * @param customProjects - The custom projects to intersperse.
 * @param repositories - The list of repositories.
 * @returns A combined list of projects.
 */
function interleaveProjects(
  customProjects: CustomProject[],
  repositories: Repository[],
): (CustomProject | Repository)[] {
  const interleavedProjects: (CustomProject | Repository)[] = [];
  let customProjectIndex = 0;
  const interleaveInterval = 5;

  for (let i = 0; i < repositories.length; i++) {
    interleavedProjects.push(repositories[i]);
    if (
      (i + 1) % interleaveInterval === 0 &&
      customProjectIndex < customProjects.length
    ) {
      interleavedProjects.push(customProjects[customProjectIndex]);
      customProjectIndex++;
    }
  }

  // Add any remaining custom projects at the end
  if (customProjectIndex < customProjects.length) {
    interleavedProjects.push(...customProjects.slice(customProjectIndex));
  }

  return interleavedProjects;
}

/**
 * Combined projects component that displays GitHub repositories and custom projects
 * @param props - Component props
 * @param props.refreshTrigger - Optional trigger to refresh data
 * @returns Combined projects display component
 */
export function Projects({ refreshTrigger }: ProjectsProps) {
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

  if (portfolioLoading || !portfolioData) {
    return <GithubIntegrationSkeleton />;
  }

  const customProjects = portfolioData.customProjects || [];
  const allProjects = interleaveProjects(customProjects, repositories);
  const hasCustomProjects = customProjects.length > 0;
  const hasAnyProjects = hasGithubUsername || hasCustomProjects;

  if (!hasAnyProjects) {
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
          <h2 className="text-xl font-bold text-foreground">Projects</h2>
        </div>
        {hasGithubUsername && (
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
                    const key = keyArray[0] as string;
                    if (
                      key !== sortBy &&
                      (key === "updated" || key === "stars")
                    ) {
                      setSortBy(key as "updated" | "stars");
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
        ) : allProjects.length === 0 ? (
          <div>No projects found</div>
        ) : (
          <div className="grid gap-4">
            {allProjects.map((project, index) => {
              const isCustom =
                "id" in project && typeof project.id === "string";
              return (
                <ProjectCard
                  key={
                    isCustom
                      ? `custom-${(project as CustomProject).id}`
                      : `github-${(project as Repository).id}`
                  }
                  index={index}
                  isCustom={isCustom}
                  project={project}
                />
              );
            })}
          </div>
        )}
      </CardBody>
      <CardFooter className="border-t border-default-200/50 bg-default-50/50">
        {portfolioData?.social?.github && (
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
        )}
      </CardFooter>
    </Card>
  );
}
