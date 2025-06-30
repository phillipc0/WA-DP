import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Education, Experience } from "@/types";

interface CVProps {
  refreshTrigger?: number;
}

export function CV({ refreshTrigger }: CVProps) {
  const { portfolioData } = usePortfolioData(refreshTrigger);

  const experiences: Experience[] = portfolioData.cv || [];
  const education: Education[] = portfolioData.education || [];

  const experienceItems = experiences
    .map((item, index) => ({
      ...item,
      type: "experience" as const,
      originalIndex: index,
    }))
    .sort((a, b) => {
      const getYear = (duration: string) => {
        const match = duration.match(/(\d{4})/);
        return match ? parseInt(match[1]) : 0;
      };
      return getYear(b.duration) - getYear(a.duration);
    });

  const educationItems = education
    .map((item, index) => ({
      ...item,
      type: "education" as const,
      originalIndex: index,
    }))
    .sort((a, b) => {
      const getYear = (duration: string) => {
        const match = duration.match(/(\d{4})/);
        return match ? parseInt(match[1]) : 0;
      };
      return getYear(b.duration) - getYear(a.duration);
    });

  const getIconText = (item: any) => {
    if (item.type === "education") {
      return "🎓";
    }
    return "💼";
  };

  const renderTimelineItem = (item: any, _: number, isLeft: boolean) => {
    return (
      <div
        key={`${item.type}-${item.originalIndex}`}
        className="relative w-full mb-8"
      >
        {/* Desktop Layout */}
        <div className="hidden md:block w-full">
          <div className="relative flex items-start">
            {/* Timeline node - centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 top-4">
              <div className="w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
                <span
                  aria-label={
                    item.type === "education" ? "Education" : "Work Experience"
                  }
                  className="text-lg"
                >
                  {getIconText(item)}
                </span>
              </div>
            </div>

            {/* Left side content */}
            {isLeft ? (
              <>
                <div className="w-1/2 pr-8">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardBody className="p-6">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.type === "experience"
                              ? item.position
                              : item.degree}
                          </h3>
                          <h4 className="text-md font-medium text-primary">
                            {item.type === "experience"
                              ? item.company
                              : item.institution}
                          </h4>
                          <p className="text-sm text-default-500">
                            {item.location}
                          </p>
                        </div>

                        <p className="text-default-700 leading-relaxed text-sm">
                          {item.description}
                        </p>

                        {item.type === "experience" &&
                          item.technologies &&
                          item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.technologies.map(
                                (tech: string, techIndex: number) => (
                                  <Chip
                                    key={techIndex}
                                    className="text-xs"
                                    color="secondary"
                                    size="sm"
                                    variant="bordered"
                                  >
                                    {tech}
                                  </Chip>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="w-1/2 pl-8 flex justify-start items-start pt-4">
                  <Chip
                    className="font-medium"
                    color="primary"
                    size="md"
                    variant="flat"
                  >
                    {item.duration}
                  </Chip>
                </div>
              </>
            ) : (
              <>
                <div className="w-1/2 pr-8 flex justify-end items-start pt-4">
                  <Chip
                    className="font-medium"
                    color="primary"
                    size="md"
                    variant="flat"
                  >
                    {item.duration}
                  </Chip>
                </div>
                <div className="w-1/2 pl-8">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardBody className="p-6">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.type === "experience"
                              ? item.position
                              : item.degree}
                          </h3>
                          <h4 className="text-md font-medium text-primary">
                            {item.type === "experience"
                              ? item.company
                              : item.institution}
                          </h4>
                          <p className="text-sm text-default-500">
                            {item.location}
                          </p>
                        </div>

                        <p className="text-default-700 leading-relaxed text-sm">
                          {item.description}
                        </p>

                        {item.type === "experience" &&
                          item.technologies &&
                          item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.technologies.map(
                                (tech: string, techIndex: number) => (
                                  <Chip
                                    key={techIndex}
                                    className="text-xs"
                                    color="secondary"
                                    size="sm"
                                    variant="bordered"
                                  >
                                    {tech}
                                  </Chip>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-start w-full">
          {/* Timeline node */}
          <div className="relative z-10 mr-6">
            <div className="w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">{getIconText(item)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-3">
              <Chip
                className="font-medium mb-3"
                color="primary"
                size="sm"
                variant="flat"
              >
                {item.duration}
              </Chip>
            </div>

            <Card className="shadow-lg">
              <CardBody className="p-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.type === "experience" ? item.position : item.degree}
                    </h3>
                    <h4 className="text-md font-medium text-primary">
                      {item.type === "experience"
                        ? item.company
                        : item.institution}
                    </h4>
                    <p className="text-sm text-default-500">{item.location}</p>
                  </div>

                  <p className="text-default-700 leading-relaxed text-sm">
                    {item.description}
                  </p>

                  {item.type === "experience" &&
                    item.technologies &&
                    item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.technologies.map(
                          (tech: string, techIndex: number) => (
                            <Chip
                              key={techIndex}
                              className="text-xs"
                              color="secondary"
                              size="sm"
                              variant="bordered"
                            >
                              {tech}
                            </Chip>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Main timeline line - Desktop */}
        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-divider hidden md:block" />

        {/* Main timeline line - Mobile */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-divider md:hidden" />

        {/* Work Experience Section */}
        {experienceItems.length > 0 && (
          <div className="mb-12">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-divider mb-8">
              <div className="py-4">
                <h2 className="text-2xl font-bold text-center">
                  <span aria-hidden="true">💼</span> Work Experience
                </h2>
              </div>
            </div>

            {/* Experience Items */}
            {experienceItems.map((item, index) =>
              renderTimelineItem(item, index, index % 2 === 0),
            )}
          </div>
        )}

        {/* Education Section */}
        {educationItems.length > 0 && (
          <div className="mb-12">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-divider mb-8">
              <div className="py-4">
                <h2 className="text-2xl font-bold text-center">
                  <span aria-hidden="true">🎓</span> Education
                </h2>
              </div>
            </div>

            {/* Education Items */}
            {educationItems.map((item, index) =>
              renderTimelineItem(item, index, index % 2 === 0),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
