import { useEffect, useState } from "react";

import { SkillLevel } from "@/types";

export const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
];

/**
 * Custom hook to detect small screen sizes
 * @param pixels - The pixel threshold for small screen detection (default: 500)
 * @returns Boolean indicating if screen is smaller than threshold
 */
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

    // Set initial state based on current screen size
    setIsSmallScreen(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [pixels]);
  return isSmallScreen;
}

/**
 * Generates slider marks for skill level display
 * @param selectedSkill - The currently selected skill level
 * @param isSmallScreen - Whether screen size is small
 * @returns Array of slider marks with labels
 */
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
