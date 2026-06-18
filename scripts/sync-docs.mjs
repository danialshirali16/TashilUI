// Push design-token changes FROM TashilUI (the source of truth) TO the
// tashilcar-docs repo, as a reviewable pull request.
//
//   TashilUI/tokens/*.json  →  tashilcar-docs/design-system/tokens-source/*.json
//
// Run manually: `pnpm sync-docs [pathToDocsRepo]`
//   - defaults the docs repo to ../Tashilcar (override with TASHILCAR_DOCS env).
//   - copies the token JSON, branches off the docs default branch, commits,
//     pushes, and opens a PR via `gh`. It never edits the docs default branch
//     directly — you review and merge the PR.
//
// Requires: the docs repo cloned locally with a GitHub `origin`, and `gh` auth.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const docsRepo =
  process.argv[2] || process.env.TASHILCAR_DOCS || resolve(repoRoot, "..", "Tashilcar");

const srcDir = join(repoRoot, "tokens");
const destRel = "design-system/tokens-source";
const destDir = join(docsRepo, destRel);

const die = (msg) => {
  console.error(`[sync-docs] ${msg}`);
  process.exit(1);
};

// run a command, returning trimmed stdout; throws on non-zero exit.
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, encoding: "utf8" }).trim();
const gitDocs = (args) => run("git", args, docsRepo);

// ── preconditions ────────────────────────────────────────────────────────────
if (!existsSync(srcDir)) die(`token source not found: ${srcDir}`);
if (!existsSync(join(docsRepo, ".git"))) die(`docs repo is not a git checkout: ${docsRepo}`);
if (!existsSync(destDir)) die(`docs token dir not found: ${destDir}`);

// Refuse to run if the docs tree has uncommitted *tracked* changes — switching
// branches could carry/clobber them. Untracked files (e.g. local .claude/) are
// fine: we only ever stage the tokens path.
if (gitDocs(["status", "--porcelain", "--untracked-files=no"])) {
  die(`docs repo has uncommitted tracked changes (${docsRepo}). Commit/stash them first.`);
}

const sourceSha = run("git", ["rev-parse", "--short", "HEAD"], repoRoot);

// Determine the docs default branch (fall back to main).
let baseBranch = "main";
try {
  baseBranch = gitDocs(["rev-parse", "--abbrev-ref", "origin/HEAD"]).replace(/^origin\//, "");
} catch {
  /* origin/HEAD not set locally — keep default */
}

console.log(`[sync-docs] docs repo:   ${docsRepo}`);
console.log(`[sync-docs] base branch: ${baseBranch}`);
console.log(`[sync-docs] source:      TashilUI@${sourceSha}`);

// ── branch off the latest docs base, then copy tokens onto it ────────────────
try {
  gitDocs(["fetch", "origin", baseBranch]);
} catch {
  console.warn("[sync-docs] WARN could not fetch origin; branching off local base.");
}

const branch = `sync/tokens-from-tashilui-${new Date().toISOString().slice(0, 10)}-${sourceSha}`;
const baseRef = (() => {
  try {
    gitDocs(["rev-parse", "--verify", `origin/${baseBranch}`]);
    return `origin/${baseBranch}`;
  } catch {
    return baseBranch;
  }
})();
gitDocs(["switch", "-C", branch, baseRef]);

const files = readdirSync(srcDir).filter((f) => f.endsWith(".json"));
for (const f of files) cpSync(join(srcDir, f), join(destDir, f));

// ── nothing changed? clean up and exit ───────────────────────────────────────
if (!gitDocs(["status", "--porcelain", destRel])) {
  console.log("[sync-docs] tokens already in sync — no PR needed.");
  gitDocs(["switch", baseBranch]);
  gitDocs(["branch", "-D", branch]);
  process.exit(0);
}

// ── commit, push, open PR ────────────────────────────────────────────────────
const changed = gitDocs(["diff", "--cached", "--name-only"]) || gitDocs(["status", "--porcelain", destRel]);
const sizeKb = (p) => Math.round(statSync(p).size / 102.4) / 10;
const fileList = files
  .map((f) => `- \`${f}\` (${sizeKb(join(destDir, f))} kB)`)
  .join("\n");

gitDocs(["add", destRel]);
const title = `Sync design tokens from TashilUI@${sourceSha}`;
const body = `Automated by \`pnpm sync-docs\` in **TashilUI** (the design-token source of truth).

Updates \`${destRel}/\` to match TashilUI@\`${sourceSha}\`.

Token files:
${fileList}

> Review and merge to bring tashilcar-docs up to date. Do not hand-edit these files —
> they are generated from TashilUI.`;

gitDocs(["commit", "-m", title, "-m", body.split("\n\n").slice(1).join("\n\n")]);
gitDocs(["push", "-u", "origin", branch]);

let prUrl = "";
try {
  prUrl = run("gh", ["pr", "create", "--base", baseBranch, "--head", branch, "--title", title, "--body", body], docsRepo);
} catch (e) {
  console.warn(`[sync-docs] WARN: pushed branch '${branch}' but 'gh pr create' failed:\n${e.message}`);
  console.warn("[sync-docs] Open the PR manually from the pushed branch.");
  process.exit(0);
}

console.log(`\n[sync-docs] ✅ PR opened:\n${prUrl}`);
console.log(`[sync-docs] changed:\n${changed}`);
