import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SkillLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

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

//TODO: consider removing or using this
export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
  social: {
    github: string;
    twitter: string;
    twitterPlatform: "twitter" | "x";
    linkedin: string;
    discord: string;
    reddit: string;
    youtube: string;
  };
  skills: Skill[];
  cv: Experience[];
  education: Education[];
}
