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

export interface CustomProject {
  id: string;
  title: string;
  description: string;
  url?: string;
  topics: string[];
  language?: string;
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
  customProjects: CustomProject[];
}
