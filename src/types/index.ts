import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

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

export interface Skill {
  name: string;
  level: number;
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
    linkedin: string;
    discord: string;
    reddit: string;
  };
  skills: Skill[];
  cv: Experience[];
  education: Education[];
}
