const fs = require("fs");
const path = require("path");

const reviewRoot = path.resolve("review-output");
const runId = new Date().toISOString().replace(/[:.]/g, "-");

fs.mkdirSync(reviewRoot, { recursive: true });
fs.writeFileSync(path.join(reviewRoot, ".run-id"), `${runId}\n`);

console.log(`AuraPay review run: ${runId}`);
