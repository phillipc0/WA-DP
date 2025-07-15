import { SkillLevel } from "@/types";

export const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
];

export function getSliderMarks() {
  return SKILL_LEVELS.map((label, i) => ({ value: i, label }));
}
