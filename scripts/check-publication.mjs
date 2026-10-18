import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'publication-manifest.json'), 'utf8'));
const allowed = new Set(manifest.files);
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0').filter(Boolean);
const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b|github_pat_[A-Za-z0-9_]{40,}/],
  ['API credential', /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/],
  ['cloud access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['personal Windows path', /[A-Z]:\\Users\\[^\\\s]+/i],
  ['personal Unix path', /\/(?:home|Users)\/[A-Za-z0-9_.-]+\//],
  ['private network address', /\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/],
];
const errors = [];
for (const file of files) {
  if (!allowed.has(file)) { errors.push(`${file}: not in publication manifest`); continue; }
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { errors.push(`${file}: listed file is missing`); continue; }
  if (fs.lstatSync(full).isSymbolicLink()) { errors.push(`${file}: symlinks cannot be published`); continue; }
  const bytes = fs.readFileSync(full);
  if (bytes.includes(0)) { errors.push(`${file}: binary file requires separate review`); continue; }
  for (const [label, pattern] of patterns) {
    if (pattern.test(bytes.toString('utf8'))) errors.push(`${file}: ${label} pattern detected`);
  }
}
for (const file of allowed) {
  if (path.isAbsolute(file) || file.split('/').includes('..')) errors.push('Manifest contains invalid path');
  if (!files.includes(file)) errors.push(`${file}: manifest entry is missing from the source set`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Publication check passed: ${files.length} explicitly reviewed text files.`);
}
