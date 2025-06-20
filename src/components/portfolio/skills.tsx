import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { getPortfolioData, PortfolioData } from "@/lib/portfolio";
import { loadDraftFromCookies } from "@/lib/cookie-persistence";
import { isAuthenticated } from "@/lib/auth";

export function Skills() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    siteConfig.portfolio,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Only check for draft data if user is authenticated
        if (isAuthenticated()) {
          const draftData = loadDraftFromCookies();
          if (draftData) {
            setPortfolioData(draftData);
            return;
          }
        }

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

export function getColorForSkill(index: number) {
  const colors = ["primary", "secondary", "success", "warning", "danger"];

  return colors[index % colors.length] as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}
