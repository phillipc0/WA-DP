import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";

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
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-small text-default-500">{skill.level}%</span>
            </div>
            <Progress 
              value={skill.level} 
              color={getColorForSkill(index)} 
              className="h-2"
              aria-label={`${skill.name} skill level`}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

// Helper function to get different colors for different skills
function getColorForSkill(index: number) {
  const colors = ["primary", "secondary", "success", "warning", "danger"];
  return colors[index % colors.length] as "primary" | "secondary" | "success" | "warning" | "danger";
}
