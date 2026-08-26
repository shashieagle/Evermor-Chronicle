#!/usr/bin/env node
/**
 * Publish smoke check for the Evermor frontend.
 *
 * Builds the frontend using the exact command/env declared in the
 * production artifact configuration (`.replit-artifact/artifact.toml`),
 * then verifies that the generated root page (`index.html`) references
 * asset files that actually exist on disk after a clean build.
 *
 * This catches two classes of regression before publish:
 *   1. The build step is skipped or fails silently -> no fresh output.
 *   2. The deployed root page references stale/missing asset files
 *      (e.g. a mismatched publicDir, a broken build script, or leftover
 *      files from a previous build that never got regenerated).
 *
 * Usage: node scripts/publish-smoke-check.mjs
 * Exit code 0 on success, non-zero with a clear message on failure.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = resolve(SCRIPT_DIR, '..'); // artifacts/evermor
const REPO_ROOT = resolve(ARTIFACT_DIR, '..', '..'); // repo root
const ARTIFACT_TOML_PATH = join(
  ARTIFACT_DIR,
  '.replit-artifact',
  'artifact.toml',
);

function fail(message) {
  console.error(`\n✗ Publish smoke check FAILED\n  ${message}\n`);
  process.exit(1);
}

/**
 * Minimal TOML reader tailored to artifact.toml's shape: `[section]`
 * headers followed by single-line `key = value` pairs, where value is a
 * quoted string or a `[ "a", "b" ]` array of quoted strings. This avoids
 * pulling in a TOML dependency for a handful of known keys, and reads the
 * live file so the check always reflects the real production config.
 */
function parseToml(text) {
  const sections = {};
  let current = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Array-of-tables headers (e.g. `[[services.production.rewrites]]`) are
    // parsed into their own bucket so their keys never leak into whichever
    // single-bracket section preceded them.
    const arrayTableMatch = line.match(/^\[\[([^\]]+)\]\]$/);
    if (arrayTableMatch) {
      current = `[[${arrayTableMatch[1]}]]#${Object.keys(sections).length}`;
      sections[current] = {};
      continue;
    }

    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      current = sectionMatch[1];
      sections[current] ??= {};
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
    if (kvMatch && current) {
      const [, key, rawValue] = kvMatch;
      sections[current][key] = parseTomlValue(rawValue.trim());
    }
  }

  return sections;
}

function parseTomlValue(raw) {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(stripQuotes);
  }
  return stripQuotes(raw);
}

function stripQuotes(s) {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

// --- 1. Read the production build configuration straight from artifact.toml ---

if (!existsSync(ARTIFACT_TOML_PATH)) {
  fail(`artifact.toml not found at ${ARTIFACT_TOML_PATH}`);
}

const toml = parseToml(readFileSync(ARTIFACT_TOML_PATH, 'utf8'));

const publicDirRel = toml['services.production']?.publicDir;
const buildArgs = toml['services.production.build']?.args;
const buildEnv = toml['services.production.build.env'] ?? {};
const rewrites = toml['[[services.production.rewrites]]']; // not used, kept for clarity

if (!publicDirRel) {
  fail(
    'services.production.publicDir is not set in artifact.toml — cannot locate build output.',
  );
}
if (!Array.isArray(buildArgs) || buildArgs.length === 0) {
  fail(
    'services.production.build.args is not set in artifact.toml — cannot determine the build command.',
  );
}

const publicDir = resolve(REPO_ROOT, publicDirRel);
const distDir = resolve(publicDir, '..'); // artifacts/evermor/dist

console.log('Publish smoke check: building Evermor via production config');
console.log(`  command: ${buildArgs.join(' ')}`);
console.log(`  env:     ${JSON.stringify(buildEnv)}`);
console.log(`  output:  ${publicDir}`);

// --- 2. Wipe any previous build output so stale files cannot survive a skipped/broken build ---

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

// --- 3. Run the exact build command declared for production, from the repo root ---

const [command, ...args] = buildArgs;
const result = spawnSync(command, args, {
  cwd: REPO_ROOT,
  env: { ...process.env, ...buildEnv, NODE_ENV: 'production' },
  stdio: 'inherit',
});

if (result.error) {
  fail(`Failed to run build command: ${result.error.message}`);
}
if (result.status !== 0) {
  fail(
    `Build command exited with status ${result.status}. The frontend was not built — publishing now would serve stale files.`,
  );
}

// --- 4. Confirm the build actually produced output ---

const indexHtmlPath = join(publicDir, 'index.html');
if (!existsSync(indexHtmlPath)) {
  fail(
    `Build reported success but no index.html was produced at ${indexHtmlPath}. The build may have been skipped or misconfigured (check publicDir vs. the frontend's build outDir).`,
  );
}

// --- 5. Parse the root page and verify every local asset it references exists on disk ---

const basePath = buildEnv.BASE_PATH ?? '/';
const html = readFileSync(indexHtmlPath, 'utf8');

const refPattern = /\b(?:src|href)="([^"]+)"/g;
const referencedAssets = [];
let match;
while ((match = refPattern.exec(html)) !== null) {
  const ref = match[1];
  // Skip external URLs, data URIs, and anchors — only check locally-served files.
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:') || ref.startsWith('#')) {
    continue;
  }
  if (!ref.startsWith(basePath)) {
    continue;
  }
  const withoutBase = ref.slice(basePath.length).split(/[?#]/)[0];
  if (!withoutBase) continue;
  referencedAssets.push({ ref, relativePath: withoutBase });
}

if (referencedAssets.length === 0) {
  fail(
    `index.html did not reference any local build assets under base path "${basePath}". Expected at least a bundled script and stylesheet.`,
  );
}

const missing = referencedAssets.filter(
  ({ relativePath }) => !existsSync(join(publicDir, relativePath)),
);

if (missing.length > 0) {
  fail(
    [
      'The root page references assets that do not exist in the build output:',
      ...missing.map(({ ref }) => `    - ${ref}`),
      `  This means the deployed root page would serve broken references (stale or skipped build).`,
    ].join('\n'),
  );
}

console.log(
  `\n✓ Publish smoke check passed: index.html references ${referencedAssets.length} local asset(s), all freshly built and present in ${publicDirRel}.`,
);
for (const { ref } of referencedAssets) {
  console.log(`    - ${ref}`);
}
