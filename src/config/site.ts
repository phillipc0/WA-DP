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
      discord: "johndoe",
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
        description: "Lead development of modern web applications using React, TypeScript, and Node.js. Mentored junior developers and collaborated with design teams to create exceptional user experiences.",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"]
      },
      {
        company: "Digital Solutions Ltd.",
        position: "Frontend Developer",
        duration: "2020 - 2022",
        location: "San Francisco, CA",
        description: "Developed responsive web applications and implemented modern UI/UX designs. Worked closely with backend teams to integrate APIs and optimize application performance.",
        technologies: ["Vue.js", "JavaScript", "SCSS", "REST APIs", "Git"]
      },
      {
        company: "StartupXYZ",
        position: "Junior Web Developer",
        duration: "2019 - 2020",
        location: "Austin, TX",
        description: "Built and maintained company websites and web applications. Gained experience in full-stack development and agile methodologies.",
        technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"]
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Master of Science in Computer Science",
        duration: "2017 - 2019",
        location: "Berlin, Germany",
        description: "Specialized in Software Engineering and Machine Learning. Graduated with honors and completed thesis on distributed systems.",
        subjects: ["Algorithms", "Data Structures", "Machine Learning", "Distributed Systems", "Software Architecture"]
      },
      {
        institution: "State University",
        degree: "Bachelor of Science in Information Technology",
        duration: "2013 - 2017",
        location: "Austin, TX",
        description: "Foundation in computer science fundamentals with focus on web development and database management.",
        subjects: ["Programming", "Database Design", "Web Development", "Network Security", "Project Management"]
      }
    ],
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
