import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Helper to convert hex to relative luminance
function hexToLuminance(hex: string): number {
  let cleanHex = hex.trim().replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Calculate WCAG contrast ratio between two luminance values
function calculateContrast(lum1: number, lum2: number): number {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return (l1 + 0.05) / (l2 + 0.05);
}

describe('Aesthetics Contrast Validation (WCAG AA)', () => {
  it('verifies light and dark neumorphic bg vs text-primary contrast >= 4.5:1', () => {
    const tokensPath = path.resolve(__dirname, '../src/styles/tokens.css');
    const cssContent = fs.readFileSync(tokensPath, 'utf8');

    // Extract light theme colors
    const lightBlock = cssContent.match(/:root\[data-theme="light"\]\s*\{([^}]+)\}/);
    expect(lightBlock).not.toBeNull();
    const lightBgMatch = lightBlock![1].match(/--nm-bg:\s*(#[a-fA-F0-9]+)/);
    const lightTextMatch = lightBlock![1].match(/--nm-text-primary:\s*(#[a-fA-F0-9]+)/);

    expect(lightBgMatch).not.toBeNull();
    expect(lightTextMatch).not.toBeNull();

    const lightBg = lightBgMatch![1];
    const lightText = lightTextMatch![1];

    const lightBgLum = hexToLuminance(lightBg);
    const lightTextLum = hexToLuminance(lightText);
    const lightContrast = calculateContrast(lightBgLum, lightTextLum);

    // Assert light mode contrast
    console.log(`Light Mode Contrast (${lightBg} vs ${lightText}): ${lightContrast.toFixed(2)}:1`);
    expect(lightContrast).toBeGreaterThanOrEqual(4.5);

    // Extract dark theme colors
    const darkBlock = cssContent.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/);
    expect(darkBlock).not.toBeNull();
    const darkBgMatch = darkBlock![1].match(/--nm-bg:\s*(#[a-fA-F0-9]+)/);
    const darkTextMatch = darkBlock![1].match(/--nm-text-primary:\s*(#[a-fA-F0-9]+)/);

    expect(darkBgMatch).not.toBeNull();
    expect(darkTextMatch).not.toBeNull();

    const darkBg = darkBgMatch![1];
    const darkText = darkTextMatch![1];

    const darkBgLum = hexToLuminance(darkBg);
    const darkTextLum = hexToLuminance(darkText);
    const darkContrast = calculateContrast(darkBgLum, darkTextLum);

    // Assert dark mode contrast
    console.log(`Dark Mode Contrast (${darkBg} vs ${darkText}): ${darkContrast.toFixed(2)}:1`);
    expect(darkContrast).toBeGreaterThanOrEqual(4.5);
  });
});
