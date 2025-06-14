import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

export function Skills() {
  const [portfolioData, setPortfolioData] = useState(siteConfig.portfolio);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        setPortfolioData(parsedData);
      } catch (error) {
        console.error("Error parsing portfolio data from localStorage:", error);
      }
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-bold">Skills</h2>
      </CardHeader>
      <CardBody className="gap-4">
        {portfolioData.skills.map((skill, index) => (
          <div key={skill.name} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-small text-default-500">
                {skill.level}%
              </span>
            </div>
            <Progress
              aria-label={`${skill.name} skill level`}
              className="h-2"
              color={getColorForSkill(index)}
              value={skill.level}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

// Helper function to get different colors for different skills
export function getColorForSkill(index: number) {
  const colors = ["primary", "secondary", "success", "warning", "danger"];

  return colors[index % colors.length] as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}
