import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | "Master";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  location: string;
  description: string;
}
