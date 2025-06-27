import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { SkillsIcon } from "@/components/icons.tsx";

interface SkillsProps {
  refreshTrigger?: number;
}

export function Skills({ refreshTrigger }: SkillsProps) {
  const { portfolioData } = usePortfolioData(refreshTrigger);

  return (
    <Card className="w-full border border-default-200/50 shadow-sm">
      <CardHeader className="flex gap-3 items-center bg-gradient-to-r from-default-50 to-default-100/50 border-b border-default-200/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
          <SkillsIcon />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-bold text-foreground">Skills</h2>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="grid gap-4">
          {portfolioData.skills.map((skill: any, index: any) => (
            <SkillCard key={`${skill.name}-${index}`} index={index} skill={skill} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

interface SkillCardProps {
  skill: { name: string; level: number };
  index: number;
}

function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <Card
      isHoverable
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30"
    >
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getSkillColor(index),
              }}
            />
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
              {skill.name}
            </h3>
          </div>
          <Chip
            className="h-6 text-xs font-medium"
            color={getChipColorForSkill(index)}
            size="sm"
            variant="flat"
          >
            {skill.level}%
          </Chip>
        </div>
        <Progress
          aria-label={`${skill.name} skill level`}
          className="h-2"
          color={getColorForSkill(index)}
          value={skill.level}
        />
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

export function getSkillColor(index: number) {
  const colors = ["#006FEE", "#7828C8", "#17C964", "#F5A524", "#F31260"];

  return colors[index % colors.length];
}

export function getChipColorForSkill(index: number) {
  const colors = ["primary", "secondary", "success", "warning", "danger"];

  return colors[index % colors.length] as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}
