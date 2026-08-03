import fs from 'fs';
import path from 'path';

// SVG string for ContinueLater icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#d946ef" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#8b5cf6" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background container -->
  <rect width="128" height="128" rx="28" fill="#0f172a" />
  
  <!-- Glowing circle accent -->
  <circle cx="64" cy="64" r="44" fill="none" stroke="url(#grad)" stroke-width="8" filter="url(#shadow)" stroke-linecap="round" stroke-dasharray="210" stroke-dashoffset="40" />

  <!-- Play / Continue Arrow -->
  <polygon points="56,44 84,64 56,84" fill="url(#grad)" />

  <!-- Clock dot indicator -->
  <circle cx="94" cy="34" r="7" fill="#38bdf8" />
</svg>`;

const dir = path.resolve(process.cwd(), 'public/icons');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'icon.svg'), svgContent);

// Simple standalone PNG fallback writer using canvas/svg
console.log('SVG icon generated successfully at public/icons/icon.svg');
