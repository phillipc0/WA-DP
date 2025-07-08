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
    avatar: "/assets/favicon.png",
    social: {
      github: "johndoe",
      twitter: "johndoe",
      linkedin: "johndoe",
      discord: "99010890275225600",
      reddit: "johndoe",
    },
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Node.js", level: 80 },
      { name: "CSS/Tailwind", level: 85 },
      { name: "UI/UX Design", level: 75 },
      { name: "GraphQL", level: 70 },
    ],
    cv: [
      {
        company: "Tech Innovators Inc.",
        position: "Senior Full Stack Developer",
        duration: "2022 - Present",
        location: "New York, NY",
        description:
          "Lead development of modern web applications using React, TypeScript, and Node.js. Mentored junior developers and collaborated with design teams to create exceptional user experiences.",
        technologies: ["React", "TypeScript", "Node.js"],
      },
      {
        company: "StartupXYZ",
        position: "Junior Web Developer",
        duration: "2019 - 2022",
        location: "Austin, TX",
        description:
          "Built and maintained company websites and web applications. Gained experience in full-stack development and agile methodologies.",
        technologies: ["GraphQL"],
      },
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Science in Computer Science",
        duration: "2017 - 2019",
        location: "Frankfurt, Germany",
        description:
          "Specialized in Software Engineering and Machine Learning. Graduated with honors and completed thesis on distributed systems.",
      },
    ],
    contributor: {
      enableContributorStatus: false,
      showGoldenBoxShadow: false,
    },
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Edit",
      href: "/edit",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Edit",
      href: "/edit",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
