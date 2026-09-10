import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import potrace from 'potrace';

const brainDir = '/Users/sbalak/.gemini/antigravity-ide/brain/6fbb158f-0aab-4f95-a24d-a417c57ad335';
const outputDir = 'src/rashi/compact';

const iconsConfig = [
  { id: 'mesha', name: 'Mesha', image: 'mesha_ram_icon_1789078484882.jpg', size: 780, blur: 1.4, turdSize: 50 },
  { id: 'rishabha', name: 'Rishabha', image: 'rishabha_bull_icon_1789078504967.jpg', size: 780, blur: 1.3, turdSize: 50 },
  { id: 'mithuna', name: 'Mithuna', image: 'mithuna_twins_icon_1789078528141.jpg', size: 780, blur: 1.3, turdSize: 45 },
  { id: 'kataka', name: 'Kataka', image: 'kataka_crab_icon_1789078547747.jpg', size: 750, blur: 1.4, turdSize: 45 },
  { id: 'simha', name: 'Simha', image: 'simha_bold_icon_1789078132939.jpg', size: 780, blur: 1.5, turdSize: 50 },
  { id: 'kanya', name: 'Kanya', image: 'kanya_maiden_icon_1789078570291.jpg', size: 780, blur: 1.4, turdSize: 45 },
  { id: 'thula', name: 'Thula', image: 'thula_scales_icon_1789078592082.jpg', size: 760, blur: 1.3, turdSize: 45 },
  { id: 'vrischika', name: 'Vrischika', image: 'vrischika_scorp_icon_1789078615050.jpg', size: 750, blur: 1.4, turdSize: 45 },
  { id: 'dhanus', name: 'Dhanus', image: 'dhanus_bow_icon_1789078636137.jpg', size: 740, blur: 1.2, turdSize: 45 },
  { id: 'makara', name: 'Makara', image: 'makara_beast_icon_1789078661587.jpg', size: 750, blur: 1.4, turdSize: 50 },
  { id: 'kumbha', name: 'Kumbha', image: 'kumbha_pot_icon_1789078745263.jpg', size: 750, blur: 1.4, turdSize: 45 },
  { id: 'meena', name: 'Meena', image: 'meena_fish_icon_1789078769418.jpg', size: 760, blur: 1.3, turdSize: 45 }
];

async function processCleanIcon(config) {
  const inputPath = path.join(brainDir, config.image);
  const safeDimension = config.size;
  const padding = Math.round((1024 - safeDimension) / 2);

  // 1. Center in safe circular zone on pure white background
  const centered = await sharp(inputPath)
    .trim()
    .resize(safeDimension, safeDimension, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: padding,
      bottom: 1024 - safeDimension - padding,
      left: padding,
      right: 1024 - safeDimension - padding,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .threshold(160)
    .toBuffer();

  // 2. Optical simplification:
  // Downscale to 256x256, apply calibrated blur to merge hairline noise & thicken primary strokes,
  // re-threshold to crisp binary, then upscale to 1024x1024 for clean vector tracing
  const cleaned = await sharp(centered)
    .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .blur(config.blur || 1.3)
    .threshold(128)
    .resize(1024, 1024, { kernel: 'lanczos3' })
    .threshold(128)
    .toFormat('png')
    .toBuffer();

  return new Promise((resolve, reject) => {
    potrace.trace(cleaned, {
      color: 'currentColor',
      threshold: 128,
      optTolerance: 0.85,
      turdSize: config.turdSize || 45,
      alphaMax: 1.0,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY
    }, (err, svg) => {
      if (err) return reject(err);

      const pathMatch = svg.match(/<path[^>]*d="([^"]+)"/i);
      if (!pathMatch) return reject(new Error(`No path for ${config.id}`));

      const cleanSvg = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1024 1024"
  fill="currentColor"
>
  <!-- ${config.name.toUpperCase()} (Clean Micro-Cut: High-Legibility Simplified Lines for Small Sizes) -->
  <path d="${pathMatch[1]}" fill="currentColor" fill-rule="evenodd" />
</svg>
`;
      const outPath = path.join(outputDir, `${config.id}.svg`);
      fs.writeFileSync(outPath, cleanSvg, 'utf8');
      console.log(`✓ Cleaned ${config.id}.svg (high-legibility simplified lines)`);
      resolve();
    });
  });
}

async function main() {
  console.log('Generating 12 Clean Micro-Cut Icons (authentic drawings with micro-noise cleaned up)...');
  for (const cfg of iconsConfig) {
    await processCleanIcon(cfg);
  }
  console.log('All 12 Clean Micro-Cut Icons successfully generated!');
}

main().catch(err => {
  console.error('Error generating cleaned icons:', err);
  process.exit(1);
});
