import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import potrace from 'potrace';

const brainDir = '/Users/sbalak/.gemini/antigravity-ide/brain/6fbb158f-0aab-4f95-a24d-a417c57ad335';
const compactDir = 'src/rashi/compact';

// Helper to fill all internal holes in a binary mask (pure solid silhouette)
async function makeSolidSilhouette(imageBuffer) {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Create a binary grid: 1 = black (graphic), 0 = white (background/hole)
  const grid = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const val = data[i * channels]; // grayscale / red channel
    grid[i] = val < 128 ? 1 : 0; // 1 for black pixels
  }

  // 2. Flood-fill from the 4 outer image borders to find all TRUE external background pixels
  const isExternalBg = new Uint8Array(width * height);
  const queue = [];

  // Seed with border pixels
  for (let x = 0; x < width; x++) {
    // Top border
    if (grid[x] === 0) { isExternalBg[x] = 1; queue.push(x); }
    // Bottom border
    const bIdx = (height - 1) * width + x;
    if (grid[bIdx] === 0) { isExternalBg[bIdx] = 1; queue.push(bIdx); }
  }
  for (let y = 0; y < height; y++) {
    // Left border
    const lIdx = y * width;
    if (grid[lIdx] === 0 && !isExternalBg[lIdx]) { isExternalBg[lIdx] = 1; queue.push(lIdx); }
    // Right border
    const rIdx = y * width + (width - 1);
    if (grid[rIdx] === 0 && !isExternalBg[rIdx]) { isExternalBg[rIdx] = 1; queue.push(rIdx); }
  }

  // Breadth-first search flood fill
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      [cx - 1, cy],
      [cx + 1, cy],
      [cx, cy - 1],
      [cx, cy + 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (grid[nIdx] === 0 && !isExternalBg[nIdx]) {
          isExternalBg[nIdx] = 1;
          queue.push(nIdx);
        }
      }
    }
  }

  // 3. Any pixel that is NOT external background is part of the solid silhouette!
  // (This fills all internal eyes, mouth lines, ribs, horn gaps, scale holes solidly)
  const outputData = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    outputData[i] = isExternalBg[i] === 1 ? 255 : 0; // 0 = black (silhouette), 255 = white
  }

  return sharp(outputData, { raw: { width, height, channels: 1 } })
    .toFormat('png')
    .toBuffer();
}

const iconsConfig = [
  { id: 'mesha', name: 'Mesha', image: 'mesha_ram_icon_1789078484882.jpg', size: 780 },
  { id: 'rishabha', name: 'Rishabha', image: 'rishabha_bull_icon_1789078504967.jpg', size: 780 },
  { id: 'mithuna', name: 'Mithuna', image: 'mithuna_twins_icon_1789078528141.jpg', size: 780 },
  { id: 'kataka', name: 'Kataka', image: 'kataka_crab_icon_1789078547747.jpg', size: 750 },
  { id: 'simha', name: 'Simha', image: 'simha_bold_icon_1789078132939.jpg', size: 780 },
  { id: 'kanya', name: 'Kanya', image: 'kanya_maiden_icon_1789078570291.jpg', size: 780 },
  { id: 'thula', name: 'Thula', image: 'thula_scales_icon_1789078592082.jpg', size: 760 },
  { id: 'vrischika', name: 'Vrischika', image: 'vrischika_scorp_icon_1789078615050.jpg', size: 750 },
  { id: 'dhanus', name: 'Dhanus', image: 'dhanus_bow_icon_1789078636137.jpg', size: 740 },
  { id: 'makara', name: 'Makara', image: 'makara_beast_icon_1789078661587.jpg', size: 750 },
  { id: 'kumbha', name: 'Kumbha', image: 'kumbha_pot_icon_1789078745263.jpg', size: 750 },
  { id: 'meena', name: 'Meena', image: 'meena_fish_icon_1789078769418.jpg', size: 760 }
];

async function generateSolidSilhouettes() {
  console.log('Generating pure solid silhouettes with ZERO inside detail...');

  for (const item of iconsConfig) {
    const inputPath = path.join(brainDir, item.image);
    const safeDimension = item.size;
    const padding = Math.round((1024 - safeDimension) / 2);

    // 1. Trim & center in safe zone
    const centeredBuffer = await sharp(inputPath)
      .trim()
      .resize(safeDimension, safeDimension, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .extend({
        top: padding,
        bottom: 1024 - safeDimension - padding,
        left: padding,
        right: 1024 - safeDimension - padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .threshold(165)
      .toBuffer();

    // 2. Fill all inside holes into solid silhouette
    const solidBuffer = await makeSolidSilhouette(centeredBuffer);

    // 3. Smooth outer contour and trace with potrace
    const smoothedBuffer = await sharp(solidBuffer)
      .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .blur(1.5)
      .threshold(128)
      .resize(1024, 1024, { kernel: 'lanczos3' })
      .threshold(128)
      .toBuffer();

    await new Promise((resolve, reject) => {
      potrace.trace(smoothedBuffer, {
        color: 'currentColor',
        threshold: 128,
        optTolerance: 0.6,
        turdSize: 40,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY
      }, (err, svg) => {
        if (err) return reject(err);
        const pathMatch = svg.match(/<path[^>]*d="([^"]+)"/i);
        if (!pathMatch) return reject(new Error(`No path for ${item.id}`));

        const cleanSvg = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1024 1024"
  fill="currentColor"
>
  <!-- ${item.name.toUpperCase()} (Pure Solid Silhouette Cut for Micro Sizes) -->
  <path d="${pathMatch[1]}" fill="currentColor" fill-rule="evenodd" />
</svg>
`;
        fs.writeFileSync(path.join(compactDir, `${item.id}.svg`), cleanSvg);
        console.log(`✓ Pure Solid Silhouette generated: ${item.id}`);
        resolve();
      });
    });
  }

  console.log('All 12 Pure Solid Silhouettes created successfully!');
}

generateSolidSilhouettes().catch(err => {
  console.error(err);
  process.exit(1);
});
