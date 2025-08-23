import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Slider } from "@heroui/slider";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { SkillsIcon } from "@/components/icons.tsx";
import { Skill, SkillLevel } from "@/types";
import { SkillsSkeleton } from "@/components/ui/skeleton";
import {
  getSliderMarks,
  SKILL_LEVELS,
  useIsSmallScreen,
} from "@/utils/skills.ts";

interface SkillsProps {
  refreshTrigger?: number;
}

const levelToIndex = (lvl: SkillLevel) => SKILL_LEVELS.indexOf(lvl);

/**
 * Skills component that displays user skills with progress bars
 * @param props - Component props
 * @param props.refreshTrigger - Optional trigger to refresh the portfolio data
 * @returns Skills display component with progress indicators
 */
export function Skills({ refreshTrigger }: SkillsProps) {
  const isSmallScreen = useIsSmallScreen();
  const { portfolioData, isLoading } = usePortfolioData(refreshTrigger);

  if (isLoading || !portfolioData) {
    return <SkillsSkeleton />;
  }

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
        <div className="grid gap-4 overflow-hidden">
          {portfolioData.skills.map((skill: any, index: number) => (
            <SkillCard
              key={`${skill.name}-${index}`}
              index={index}
              isSmallScreen={isSmallScreen}
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
  isSmallScreen: boolean;
}

/**
 * Individual skill card component
 * @param props - Component props
 * @param props.skill - Skill object with name and level
 * @param props.index - Index of the skill for color assignment
 * @param props.isSmallScreen - Whether screen size is small
 * @returns Skill card with progress bar
 */
function SkillCard({ skill, index, isSmallScreen }: SkillCardProps) {
  return (
    <Card
      isHoverable
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-default-200/50 hover:border-primary/30 skill-card-enter"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
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
          marks={getSliderMarks(skill.level, isSmallScreen)}
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

/**
 * Gets the color for a skill based on its index
 * @param index - The skill index
 * @returns Color string for the skill
 */
export function getColorForSkill(index: number) {
  const colors = ["primary", "secondary", "success", "warning", "danger"];

  return colors[index % colors.length] as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

/**
 * Gets the hex color for a skill based on its index
 * @param index - The skill index
 * @returns Hex color string for the skill
 */
export function getSkillColor(index: number) {
  const colors = ["#006FEE", "#7828C8", "#17C964", "#F5A524", "#F31260"];

  return colors[index % colors.length];
}

/**
 * Gets the chip color for a skill based on its index
 * @param index - The skill index
 * @returns Chip color string for the skill
 */
export function getChipColorForSkill(index: number) {
  const colors = ["primary", "secondary", "success", "warning", "danger"];

  return colors[index % colors.length] as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}
