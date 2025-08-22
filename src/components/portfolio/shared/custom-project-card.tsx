import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";

import { CustomProject } from "@/types";

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
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30 repo-card-enter"
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
              >
                🔗 {project.url}
              </Link>
            )}
          </div>
          <div className="ml-4 flex flex-col items-end">
            <div className="bg-default-100 px-2 py-1 rounded text-xs font-medium text-default-600">
              Custom
            </div>
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
        </div>
      </CardBody>
    </Card>
  );
}
