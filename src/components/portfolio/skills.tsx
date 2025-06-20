import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { PortfolioData, getPortfolioData } from "@/lib/portfolio";

export function Skills() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    siteConfig.portfolio,
  );

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPortfolioData();
        if (data) {
          setPortfolioData(data);
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      }
    };

    loadData();
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
