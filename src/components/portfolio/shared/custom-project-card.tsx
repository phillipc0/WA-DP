import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";

import { CustomProject } from "@/types";
import { getLanguageColor } from "@/lib/language-colors";

interface CustomProjectCardProps {
  project: CustomProject;
  index: number;
}

/**
 * Renders a custom project card
 * @param props - Component props
 * @param props.project - The custom project data
 * @param props.index - Index for animation delay
 * @returns Custom project card component
 */
export function CustomProjectCard({ project, index }: CustomProjectCardProps) {
  return (
    <Card
      key={`custom-${project.id}`}
      isHoverable
      as={project.url ? Link : undefined}
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30 repo-card-enter"
      href={project.url}
      isExternal={!!project.url}
      isPressable={!!project.url}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
            <p className="text-sm text-default-700 mt-1 line-clamp-2">
              {project.description || "No description available"}
            </p>
            {project.url && (
              <Link
                isExternal
                className="text-sm text-primary hover:text-primary-600 transition-colors duration-200 mt-1 py-0.5 inline-block"
                href={project.url}
                onClick={(e) => e.stopPropagation()}
              >
                🔗 {project.url}
              </Link>
            )}
          </div>
          <div className="ml-4 flex flex-col items-end gap-2">
            <div className="bg-default-100 px-2 py-1 rounded text-xs font-medium text-default-600">
              Project
            </div>
            {project.url && (
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
            )}
          </div>
        </div>

        <div className="space-y-2">
          {project.topics && project.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.topics.slice(0, 6).map((topic) => (
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
              {project.topics.length > 6 && (
                <Chip
                  className="h-5 text-xs"
                  color="default"
                  size="sm"
                  variant="flat"
                >
                  +{project.topics.length - 6}
                </Chip>
              )}
            </div>
          )}
          {project.language && (
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getLanguageColor(project.language),
                }}
              />
              <span className="text-sm text-default-600 font-medium">
                {project.language}
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
