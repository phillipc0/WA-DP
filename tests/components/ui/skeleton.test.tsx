import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Skeleton,
  PersonalInfoSkeleton,
  SkillsSkeleton,
  CVSkeleton,
  GithubIntegrationSkeleton,
} from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders with default props", () => {
    render(<Skeleton />);
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Skeleton className="custom-class" />);
    const skeleton = document.querySelector(".custom-class");
    expect(skeleton).toBeInTheDocument();
  });

  it("applies custom width and height styles", () => {
    render(<Skeleton width="200px" height="40px" />);
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toHaveStyle({ width: "200px", height: "40px" });
  });

  it("has default gradient background", () => {
    render(<Skeleton />);
    const skeleton = document.querySelector(".bg-gradient-to-r");
    expect(skeleton).toBeInTheDocument();
  });

  it("has animate-pulse class for loading animation", () => {
    render(<Skeleton />);
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });
});

describe("PersonalInfoSkeleton", () => {
  it("renders personal info skeleton structure", () => {
    render(<PersonalInfoSkeleton />);

    // Check for skeleton animations
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders avatar skeleton", () => {
    render(<PersonalInfoSkeleton />);
    const avatarSkeleton = document.querySelector(".w-20.h-20.rounded-full");
    expect(avatarSkeleton).toBeInTheDocument();
  });

  it("renders name and title skeletons", () => {
    render(<PersonalInfoSkeleton />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it("renders chip skeletons", () => {
    render(<PersonalInfoSkeleton />);
    const chipSkeletons = document.querySelectorAll(".rounded-full");
    expect(chipSkeletons.length).toBeGreaterThan(2);
  });

  it("renders social media placeholder skeletons", () => {
    render(<PersonalInfoSkeleton />);
    const socialSkeletons = document.querySelectorAll("[style*='width: 60px']");
    expect(socialSkeletons.length).toBe(5);
  });
});

describe("SkillsSkeleton", () => {
  it("renders skills skeleton structure", () => {
    render(<SkillsSkeleton />);

    // Check for skeleton animations
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders header with icon and title skeletons", () => {
    render(<SkillsSkeleton />);
    const headerIconSkeleton = document.querySelector(".w-10.h-10.rounded-lg");
    expect(headerIconSkeleton).toBeInTheDocument();
  });

  it("renders 6 skill item skeletons", () => {
    render(<SkillsSkeleton />);
    const skillCards = document.querySelectorAll(".border-default-200\\/50");
    expect(skillCards.length).toBeGreaterThanOrEqual(6);
  });

  it("renders skill progress bar skeletons", () => {
    render(<SkillsSkeleton />);
    const progressBars = document.querySelectorAll("[style*='height: 8px']");
    expect(progressBars.length).toBe(6);
  });

  it("renders skill level indicator skeletons", () => {
    render(<SkillsSkeleton />);
    const levelIndicators = document.querySelectorAll("[style*='width: 40px']");
    expect(levelIndicators.length).toBe(6);
  });
});

describe("CVSkeleton", () => {
  it("renders CV skeleton structure", () => {
    render(<CVSkeleton />);
    const container = document.querySelector(".w-full.py-8");
    expect(container).toBeInTheDocument();
  });

  it("renders work experience section", () => {
    render(<CVSkeleton />);
    const experienceSection = document.querySelector(".mb-12");
    expect(experienceSection).toBeInTheDocument();
  });

  it("renders experience section header", () => {
    render(<CVSkeleton />);
    const header = document.querySelector(
      "[style*='width: 200px'][style*='height: 32px']",
    );
    expect(header).toBeInTheDocument();
  });

  it("renders 2 experience items", () => {
    render(<CVSkeleton />);
    const experienceItems = document.querySelectorAll(".relative.w-full.mb-8");
    expect(experienceItems.length).toBeGreaterThanOrEqual(2);
  });

  it("renders desktop and mobile layouts", () => {
    render(<CVSkeleton />);
    const desktopLayout = document.querySelector(".hidden.md\\:block");
    const mobileLayout = document.querySelector(".flex.md\\:hidden");
    expect(desktopLayout).toBeInTheDocument();
    expect(mobileLayout).toBeInTheDocument();
  });

  it("renders education section", () => {
    render(<CVSkeleton />);
    const educationHeader = document.querySelector(
      "[style*='width: 150px'][style*='height: 32px']",
    );
    expect(educationHeader).toBeInTheDocument();
  });

  it("renders company/school icon skeletons", () => {
    render(<CVSkeleton />);
    const iconSkeletons = document.querySelectorAll(".w-12.h-12.rounded-full");
    expect(iconSkeletons.length).toBeGreaterThan(2);
  });
});

describe("GithubIntegrationSkeleton", () => {
  it("renders GitHub integration skeleton structure", () => {
    render(<GithubIntegrationSkeleton />);
    // Check for skeleton animations
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders header with icon and title skeletons", () => {
    render(<GithubIntegrationSkeleton />);
    const iconSkeleton = document.querySelector(".w-10.h-10.rounded-lg");
    const titleSkeleton = document.querySelector("[style*='width: 180px']");
    expect(iconSkeleton).toBeInTheDocument();
    expect(titleSkeleton).toBeInTheDocument();
  });

  it("renders sort dropdown skeleton", () => {
    render(<GithubIntegrationSkeleton />);
    const dropdownSkeleton = document.querySelector(
      "[style*='width: 140px'][style*='height: 32px']",
    );
    expect(dropdownSkeleton).toBeInTheDocument();
  });

  it("renders 4 repository item skeletons", () => {
    render(<GithubIntegrationSkeleton />);
    const repoCards = document.querySelectorAll(".border-default-200\\/50");
    expect(repoCards.length).toBeGreaterThanOrEqual(4);
  });

  it("renders repository name and description skeletons", () => {
    render(<GithubIntegrationSkeleton />);
    const nameSkeletons = document.querySelectorAll(
      "[style*='width: 150px'][style*='height: 20px']",
    );
    expect(nameSkeletons.length).toBe(4);
  });

  it("renders language tag skeletons", () => {
    render(<GithubIntegrationSkeleton />);
    const languageSkeletons = document.querySelectorAll(
      "[style*='width: 60px'][style*='height: 20px']",
    );
    expect(languageSkeletons.length).toBe(12); // 3 tags per repo × 4 repos
  });

  it("renders stats skeletons (stars, forks)", () => {
    render(<GithubIntegrationSkeleton />);
    const statSkeletons = document.querySelectorAll(".w-3.h-3.rounded-full");
    expect(statSkeletons.length).toBe(4); // 1 per repo
  });

  it("renders footer skeleton", () => {
    render(<GithubIntegrationSkeleton />);
    const footerSkeleton = document.querySelector(
      ".border-t.border-default-200\\/50",
    );
    expect(footerSkeleton).toBeInTheDocument();
  });
});
