import { useEffect, useState } from "react";

import { SkillLevel } from "@/types";

export const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
];

export function useIsSmallScreen(pixels: number = 500) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: " + pixels + "px)");
    const handleChange = (e: any) => setIsSmallScreen(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return isSmallScreen;
}

export function getSliderMarks(
  selectedSkill: SkillLevel,
  isSmallScreen: boolean,
) {
  return SKILL_LEVELS.map((label, i) => {
    {
      if (isSmallScreen) {
        // For small screens only show selected mark, to avoid overlapping
        if (selectedSkill === label) return { value: i, label };
        else return { value: i, label: "" };
      } else {
        return { value: i, label };
      }
    }
  });
}
