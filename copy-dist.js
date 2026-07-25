const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, 'frontend', 'dist');
const dest = path.join(__dirname, 'dist');

if (!fs.existsSync(src)) {
  console.error('Source directory not found:', src);
  process.exit(1);
}

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

rimraf(dest);
copyDir(src, dest);
console.log('Copied', src, '->', dest);
