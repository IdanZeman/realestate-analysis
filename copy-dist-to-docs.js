import fs from 'fs';
import path from 'path';

const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

try {
  if (fs.existsSync('dist')) {
    // Clear docs directory first to avoid stale assets
    if (fs.existsSync('docs')) {
      fs.rmSync('docs', { recursive: true, force: true });
    }
    copyDir('dist', 'docs');
    console.log('Successfully copied dist/ to docs/ for custom GitHub Pages deployments!');
  } else {
    console.error('dist/ directory does not exist. Build may have failed.');
  }
} catch (e) {
  console.error('Error synchronizing dist to docs:', e);
}
