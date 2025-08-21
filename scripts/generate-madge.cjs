const madge = require("madge");
const fs = require("fs");
const path = require("path");

(async () => {
  const res = await madge("src", {
    fileExtensions: ["ts", "tsx"],
    tsConfig: path.join(__dirname, "../tsconfig.json"),
  });

  const circular = await res.circular();
  if (circular.length > 0) {
    console.warn("⚠️ Circular dependencies detected:");
    console.warn(circular.join("\n"));
  }

  const docsDir = path.join(__dirname, "../docs");
  fs.mkdirSync(docsDir, { recursive: true });

  await res.image(path.join(docsDir, "dependency-graph.svg"));

  const deps = res.obj();
  const metrics = {};
  for (const [file, depList] of Object.entries(deps)) {
    const dir = path.dirname(file);
    const uniqueDeps = new Set(depList);
    const coupling = uniqueDeps.size;
    const sameDirDeps = depList.filter((d) => path.dirname(d) === dir).length;
    const cohesion =
      coupling === 0 ? 1 : parseFloat((sameDirDeps / coupling).toFixed(2));
    metrics[file] = { coupling, cohesion };
  }
  fs.writeFileSync(
    path.join(docsDir, "dependency-metrics.json"),
    JSON.stringify(metrics, null, 2),
  );

  if (circular.length > 0) {
    console.error(
      `Dependency graph contains ${circular.length} circular dependencies.`,
    );
    process.exit(1);
  }
})();
