const fs = require("fs");
const path = require("path");

const defaultPortfolioData = {
  name: "John Doe",
  title: "Full Stack Developer",
  bio: "Passionate developer with expertise in React, TypeScript, and Node.js. I love building beautiful and functional web applications.",
  location: "New York, USA",
  email: "john.doe@example.com",
  avatar: "",
  social: {
    github: "johndoe",
    twitter: "johndoe",
    twitterPlatform: "twitter",
    linkedin: "johndoe",
    discord: "99010890275225600",
    reddit: "johndoe",
    youtube: "johndoe",
    steam: "76561197984767093",
  },
  skills: [
    { name: "React", level: "Master" },
    { name: "TypeScript", level: "Expert" },
    { name: "Node.js", level: "Expert" },
    { name: "CSS/Tailwind", level: "Advanced" },
    { name: "UI/UX Design", level: "Intermediate" },
    { name: "GraphQL", level: "Beginner" },
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
};

function syncPortfolio() {
  const sourcePath = path.join(
    process.cwd(),
    "backend",
    "data",
    "portfolio.json",
  );
  const destPath = path.join(
    process.cwd(),
    "backend",
    "frontend",
    "portfolio.json",
  );
  const defaultDataString = JSON.stringify(defaultPortfolioData, null, 2);

  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log("Synced portfolio.json to public directory.");
    } else {
      fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      fs.writeFileSync(sourcePath, defaultDataString);
      fs.writeFileSync(destPath, defaultDataString);
      console.log(
        "Created default portfolio.json in data/ and frontend/ directories.",
      );
    }
  } catch (error) {
    console.error("Failed to sync portfolio.json:", error);
    process.exit(1);
  }
}

syncPortfolio();
