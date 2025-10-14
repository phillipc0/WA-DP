import fs from "fs";
import path from "path";

async function getSiteConfig() {
  const configModule = await import("../src/config/site.ts");
  return configModule.siteConfig;
}

async function syncPortfolio() {
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

  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log("Synced portfolio.json to public directory.");
    } else {
      const siteConfig = await getSiteConfig();
      const defaultData = JSON.stringify(siteConfig.portfolio, null, 2);

      fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      fs.writeFileSync(sourcePath, defaultData);
      fs.writeFileSync(destPath, defaultData);
      console.log(
        "Created default portfolio.json in data and public directories.",
      );
    }
  } catch (error) {
    console.error("Failed to sync portfolio.json:", error);
    process.exit(1);
  }
}

syncPortfolio();
