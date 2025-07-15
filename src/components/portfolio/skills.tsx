import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { SkillsIcon } from "@/components/icons.tsx";
import { Skill, SkillLevel } from "@/types";

interface SkillsProps {
  refreshTrigger?: number;
}

const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
];

const levelToIndex = (lvl: SkillLevel) => SKILL_LEVELS.indexOf(lvl);

export function Skills({ refreshTrigger }: SkillsProps) {
  const { portfolioData } = usePortfolioData(refreshTrigger);
  return (
    <Card className="w-full border border-default-200/50 shadow-sm">
      <CardHeader className="flex flex-wrap gap-3 items-center bg-gradient-to-r from-default-50 to-default-100/50 border-b border-default-200/50">
        <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
          <SkillsIcon />
        </div>
        <h2 className="text-xl font-bold text-foreground">Skills</h2>

        <Divider className="basis-full" />

        <div className="basis-full mx-4 grid grid-cols-9 text-center text-default-700 text-sm font-medium select-none">
          {SKILL_LEVELS.map((level) => (
            <>
              <span key={level} className="flex justify-center">
                {level}
              </span>
              <span />
            </>
          ))}
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="grid gap-4">
          {portfolioData.skills.map((skill: any, index: number) => (
            <SkillCard
              key={`${skill.name}-${index}`}
              index={index}
              skill={skill}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

interface SkillCardProps {
  skill: Skill;
  index: number;
}

function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <Card
      isHoverable
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30"
    >
      <CardBody className="py-2.5 px-3">
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
            className="h-6 text-sm text-default-900"
            color={getChipColorForSkill(index)}
            size="sm"
            variant="bordered"
          >
            {skill.level}
          </Chip>
        </div>
        <Slider
          disableThumbScale
          isDisabled
          showSteps
          className="opacity-100 px-4"
          color={getChipColorForSkill(index)}
          marks={SKILL_LEVELS.map((label, i) => {
            if (i === levelToIndex(skill.level)) return { value: i, label };
            else return { value: i, label: "" };
          })}
          maxValue={4}
          minValue={0}
          step={1}
          value={levelToIndex(skill.level)}
          // @ts-ignore
          onChange={(val) => handleNewSkillLevelChange(indexToLevel(val))}
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
