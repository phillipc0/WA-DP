import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Experience, Education } from "@/types";

interface CVProps {
  refreshTrigger?: number;
}

export function CV({ refreshTrigger }: CVProps) {
  const { portfolioData } = usePortfolioData(refreshTrigger);

  const experiences: Experience[] = portfolioData.cv || [];
  const education: Education[] = portfolioData.education || [];

  return (
    <div className="w-full space-y-6">
      {/* Work Experience Card */}
      <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-bold">Work Experience</h2>
      </CardHeader>
      <CardBody className="gap-6">
        {experiences.length === 0 ? (
          <div className="text-center text-default-500 py-8">
            <p>No work experience added yet.</p>
          </div>
        ) : (
          experiences.map((experience, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full mt-1"></div>
              
              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="absolute left-1.5 top-3 w-px h-full bg-divider -translate-x-0.5"></div>
              )}
              
              {/* Content */}
              <div className="ml-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {experience.position}
                  </h3>
                  <Chip
                    className="self-start sm:self-center mt-1 sm:mt-0"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    {experience.duration}
                  </Chip>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <h4 className="text-md font-medium text-primary">
                    {experience.company}
                  </h4>
                  <p className="text-sm text-default-500">
                    {experience.location}
                  </p>
                </div>
                
                <p className="text-default-700 mb-3 leading-relaxed">
                  {experience.description}
                </p>
                
                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, techIndex) => (
                      <Chip
                        key={techIndex}
                        className="text-xs"
                        color="secondary"
                        size="sm"
                        variant="bordered"
                      >
                        {tech}
                      </Chip>
                    ))}
                  </div>
                )}
                
                {index < experiences.length - 1 && (
                  <Divider className="mt-6" />
                )}
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
    
    {/* Education Card */}
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-bold">Education</h2>
      </CardHeader>
      <CardBody className="gap-6">
        {education.length === 0 ? (
          <div className="text-center text-default-500 py-8">
            <p>No education added yet.</p>
          </div>
        ) : (
          education.map((edu, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full mt-1"></div>
              
              {/* Timeline line */}
              {index < education.length - 1 && (
                <div className="absolute left-1.5 top-3 w-px h-full bg-divider -translate-x-0.5"></div>
              )}
              
              {/* Content */}
              <div className="ml-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {edu.degree}
                  </h3>
                  <Chip
                    className="self-start sm:self-center mt-1 sm:mt-0"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    {edu.duration}
                  </Chip>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <h4 className="text-md font-medium text-primary">
                    {edu.institution}
                  </h4>
                  <p className="text-sm text-default-500">
                    {edu.location}
                  </p>
                </div>
                
                <p className="text-default-700 mb-3 leading-relaxed">
                  {edu.description}
                </p>
                
                {edu.subjects && edu.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {edu.subjects.map((subject, subjectIndex) => (
                      <Chip
                        key={subjectIndex}
                        className="text-xs"
                        color="secondary"
                        size="sm"
                        variant="bordered"
                      >
                        {subject}
                      </Chip>
                    ))}
                  </div>
                )}
                
                {index < education.length - 1 && (
                  <Divider className="mt-6" />
                )}
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
    </div>
  );
}
