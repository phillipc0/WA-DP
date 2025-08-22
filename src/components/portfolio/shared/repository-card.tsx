import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";

import { getLanguageColor } from "@/lib/language-colors";

export type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
};

interface RepositoryCardProps {
  repo: Repository;
  index: number;
}

/**
 * Renders a GitHub repository card
 * @param props - Component props
 * @param props.repo - The repository data
 * @param props.index - Index for animation delay
 * @returns Repository card component
 */
export function RepositoryCard({ repo, index }: RepositoryCardProps) {
  return (
    <Card
      key={repo.id}
      isExternal
      isHoverable
      isPressable
      as={Link}
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30 repo-card-enter"
      href={repo.html_url}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
              {repo.name}
            </h3>
            <p className="text-sm text-default-700 mt-1 line-clamp-2">
              {repo.description || "No description available"}
            </p>
            {repo.homepage && (
              <Link
                isExternal
                className="text-sm text-primary hover:text-primary-600 transition-colors duration-200 mt-1 py-0.5 inline-block"
                href={repo.homepage}
                onClick={(e) => e.stopPropagation()}
              >
                🔗 {repo.homepage}
              </Link>
            )}
          </div>
          <div className="ml-4 flex flex-col items-end">
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
                <span className="text-sm text-default-600 font-medium">
                  {repo.language}
                </span>
              </div>
            )}

            <Link
              isExternal
              className="flex items-center gap-1 text-sm py-0.5 text-default-500 hover:text-primary-600 transition-colors duration-200"
              href={`${repo.html_url}/stargazers`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-5 h-5 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{repo.stargazers_count.toLocaleString("de-DE")}</span>
            </Link>

            <Link
              isExternal
              className="flex items-center gap-1 text-sm py-0.5 text-default-500 hover:text-primary-600 transition-colors duration-200"
              href={`${repo.html_url}/network/members`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-5 h-5 mt-0.5"
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
  );
}
