import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, 'assets', 'icons');
const targetDir = path.join(rootDir, 'dist', 'icons');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function clearSvgFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const filePath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.svg')) {
      fs.unlinkSync(filePath);
    }
  }
}

if (!fs.existsSync(sourceDir)) {
  console.warn(`Skip icon sync: source folder does not exist (${sourceDir})`);
  process.exit(0);
}

ensureDir(targetDir);
clearSvgFiles(targetDir);

let copied = 0;

for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.svg')) {
    continue;
  }

  fs.copyFileSync(path.join(sourceDir, entry.name), path.join(targetDir, entry.name));
  copied += 1;
}

console.log(`Synced ${copied} icon files -> ${path.relative(rootDir, targetDir)}`);
