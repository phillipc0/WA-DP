export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Developer Portfolio",
  description: "Generate your own developer portfolio in seconds.",
  // Personal information for portfolio
  portfolio: {
    name: "John Doe",
    title: "Full Stack Developer",
    bio: "Passionate developer with expertise in React, TypeScript, and Node.js. I love building beautiful and functional web applications.",
    location: "New York, USA",
    email: "john.doe@example.com",
    avatar:
      "https://raw.githubusercontent.com/phillipc0/WA-DP/refs/heads/main/assets/favicon.png",
    social: {
      github: "johndoe",
      twitter: "johndoe",
      linkedin: "johndoe",
    },
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Node.js", level: 80 },
      { name: "CSS/Tailwind", level: 85 },
      { name: "UI/UX Design", level: 75 },
      { name: "GraphQL", level: 70 },
    ],
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Generator",
      href: "/generator",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
