import fs from "fs";
import path from "path";

const raw = JSON.parse(fs.readFileSync("cloc-files.json", "utf8"));
const modules = {};
const layers = { App: 0, Libs: 0, Tests: 0 };

for (const [file, stats] of Object.entries(raw)) {
  if (file === "header" || file === "SUM") continue;
  const code = stats.code || 0;
  const filePath = file.replace(/\\/g, "/");

  if (filePath.startsWith("src/")) {
    const rel = path.relative("src", filePath);
    const mod = rel.split("/")[0] || "root";
    modules[mod] = (modules[mod] ?? 0) + code;
  }

  let layer;
  if (filePath.startsWith("tests/") || filePath.startsWith("cypress/")) {
    layer = "Tests";
  } else if (
    filePath.includes("/lib/") ||
    filePath.startsWith("lib/") ||
    filePath.includes("/libs/") ||
    filePath.startsWith("libs/") ||
    filePath.startsWith("src/lib/") ||
    filePath.startsWith("src/libs/") ||
    filePath.includes("/config/") ||
    filePath.startsWith("config/") ||
    filePath.startsWith("src/config") ||
    filePath.includes("/types/") ||
    filePath.startsWith("types/") ||
    filePath.startsWith("src/types/")
  ) {
    layer = "Libs";
  } else {
    layer = "App";
  }

  layers[layer] = (layers[layer] ?? 0) + code;
}

console.log("LOC per Module");
console.table(
  Object.entries(modules)
    .sort(([, a], [, b]) => b - a)
    .map(([module, loc]) => ({ module, loc })),
);

console.log("LOC per Layer");
console.table(
  Object.entries(layers)
    .sort(([, a], [, b]) => b - a)
    .map(([layer, loc]) => ({ layer, loc })),
);

let summary = "# Code Overview\n\n";
summary += "## LOC per Module\n\n";
summary += "| Module | LOC |\n|-------|----:|\n";
for (const [module, loc] of Object.entries(modules).sort(
  ([, a], [, b]) => b - a,
)) {
  summary += `| ${module} | ${loc} |\n`;
}

summary += "\n## LOC per Layer\n\n";
summary += "| Layer | LOC |\n|-------|----:|\n";
for (const [layer, loc] of Object.entries(layers).sort(
  ([, a], [, b]) => b - a,
)) {
  summary += `| ${layer} | ${loc} |\n`;
}

fs.writeFileSync("loc-summary.md", summary);
