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
    github: "",
    twitter: "",
    twitterPlatform: "twitter",
    linkedin: "",
    discord: "",
    reddit: "",
    youtube: "",
    steam: "",
  },
  skills: [],
  cv: [],
  education: [],
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
