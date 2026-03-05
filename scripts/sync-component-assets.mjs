import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const componentsDir = path.join(rootDir, 'components');
const distComponentsDir = path.join(rootDir, 'dist', 'components');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDirRecursive(sourceDir, targetDir) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function clearDistComponentAssets() {
  if (!fs.existsSync(distComponentsDir)) {
    return;
  }

  for (const componentEntry of fs.readdirSync(distComponentsDir, { withFileTypes: true })) {
    if (!componentEntry.isDirectory()) {
      continue;
    }

    const assetsPath = path.join(distComponentsDir, componentEntry.name, 'assets');
    if (fs.existsSync(assetsPath)) {
      fs.rmSync(assetsPath, { recursive: true, force: true });
    }
  }
}

ensureDir(distComponentsDir);
clearDistComponentAssets();

let copiedFileCount = 0;

for (const componentEntry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
  if (!componentEntry.isDirectory()) {
    continue;
  }

  const assetSourceDir = path.join(componentsDir, componentEntry.name, 'assets');
  if (!fs.existsSync(assetSourceDir)) {
    continue;
  }

  const assetTargetDir = path.join(distComponentsDir, componentEntry.name, 'assets');
  copyDirRecursive(assetSourceDir, assetTargetDir);

  copiedFileCount += fs.readdirSync(assetSourceDir, { withFileTypes: true }).filter((entry) => entry.isFile()).length;
}

console.log(`Synced component assets (${copiedFileCount} files) -> ${path.relative(rootDir, distComponentsDir)}`);
