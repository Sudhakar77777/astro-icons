import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import potrace from 'potrace';

const brainDir = '/Users/sbalak/.gemini/antigravity-ide/brain/6fbb158f-0aab-4f95-a24d-a417c57ad335';
const outputDir = 'src/rashi/compact';

const iconConfigs = [
  {
    id: 'dhanus',
    name: 'Dhanus',
    image: 'dhanus_bow_icon_1789078636137.jpg',
    size: 740,
    // Bow wood is solid, arrow & string open (original clean geometry)
    isProtectedPixel: (x, y) => true,
    turdSize: 15
  },
  {
    id: 'thula',
    name: 'Thula',
    image: 'thula_scales_icon_1789078592082.jpg',
    size: 760,
    // Scales: open space between beam, strings, and pans
    isProtectedPixel: (x, y) => true,
    turdSize: 15
  },
  {
    id: 'simha',
    name: 'Simha',
    image: 'simha_bold_icon_1789078132939.jpg',
    size: 780,
    // Simha: fill outer mane hair into solid masses, preserve face details
    isProtectedPixel: (x, y) => x >= 405 && x <= 618 && y >= 380 && y <= 700,
    turdSize: 12
  },
  {
    id: 'mesha',
    name: 'Mesha',
    image: 'mesha_ram_icon_1789078484882.jpg',
    size: 780,
    // Mesha: fill horns and wool fleece solid, preserve ram face
    isProtectedPixel: (x, y) => x >= 415 && x <= 610 && y >= 420 && y <= 660,
    turdSize: 12
  },
  {
    id: 'rishabha',
    name: 'Rishabha',
    image: 'rishabha_bull_icon_1789078504967.jpg',
    size: 780,
    // Rishabha: fill horns, hump & neck solid, preserve bull face details
    isProtectedPixel: (x, y) => x >= 410 && x <= 620 && y >= 390 && y <= 680,
    turdSize: 12
  },
  {
    id: 'makara',
    name: 'Makara',
    image: 'makara_beast_icon_1789078661587.jpg',
    size: 750,
    // Makara: fill crest and scaly tail/body solid, preserve snout, eye, open jaws
    isProtectedPixel: (x, y) => x >= 200 && x <= 460 && y >= 370 && y <= 640,
    turdSize: 12
  },
  {
    id: 'mithuna',
    name: 'Mithuna',
    image: 'mithuna_twins_icon_1789078528141.jpg',
    size: 780,
    // Mithuna: fill hair, crowns, garments solid, preserve twin faces
    isProtectedPixel: (x, y) => (x >= 320 && x <= 490 && y >= 330 && y <= 570) || (x >= 510 && x <= 680 && y >= 330 && y <= 570),
    turdSize: 12
  },
  {
    id: 'kanya',
    name: 'Kanya',
    image: 'kanya_maiden_icon_1789078570291.jpg',
    size: 780,
    // Kanya: fill entire saree and hair mass solid, preserve face and flower hand
    isProtectedPixel: (x, y) => (x >= 480 && x <= 700 && y >= 200 && y <= 440) || (x >= 320 && x <= 420 && y >= 320 && y <= 440),
    turdSize: 12
  },
  {
    id: 'kumbha',
    name: 'Kumbha',
    image: 'kumbha_pot_icon_1789078745263.jpg',
    size: 750,
    // Kumbha: lady and pot solid, keep flowing water details and gap
    isProtectedPixel: (x, y) => x > 540 && y >= 350,
    turdSize: 12
  },
  {
    id: 'kataka',
    name: 'Kataka',
    image: 'kataka_crab_icon_1789078547747.jpg',
    size: 750,
    // Kataka: carapace and big claws solid, legs separated cleanly
    isProtectedPixel: (x, y) => y < 350 || y > 600 || x < 300 || x > 720,
    turdSize: 12
  },
  {
    id: 'vrischika',
    name: 'Vrischika',
    image: 'vrischika_scorp_icon_1789078615050.jpg',
    size: 750,
    // Vrischika: carapace and claws solid, tail segments distinct
    isProtectedPixel: (x, y) => y < 350 || y > 640 || x < 300 || x > 720,
    turdSize: 12
  },
  {
    id: 'meena',
    name: 'Meena',
    image: 'meena_fish_icon_1789078769418.jpg',
    size: 760,
    // Meena: two fish bold bodies, fin cuts and eye dots
    isProtectedPixel: (x, y) => true,
    turdSize: 15
  }
];

async function processIcon(config) {
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
    .threshold(165)
    .toBuffer();

  const { data, info } = await sharp(centered).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const grid = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    grid[i] = data[i * info.channels] < 128 ? 1 : 0; // 1 = black
  }

  // 2. Flood fill from outer 4 borders to find true external background
  const isExternalBg = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) {
    if (grid[x] === 0) { isExternalBg[x] = 1; queue.push(x); }
    const b = (h - 1) * w + x;
    if (grid[b] === 0 && !isExternalBg[b]) { isExternalBg[b] = 1; queue.push(b); }
  }
  for (let y = 0; y < h; y++) {
    const l = y * w;
    if (grid[l] === 0 && !isExternalBg[l]) { isExternalBg[l] = 1; queue.push(l); }
    const r = y * w + (w - 1);
    if (grid[r] === 0 && !isExternalBg[r]) { isExternalBg[r] = 1; queue.push(r); }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);
    const nbs = [[cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1]];
    for (const [nx, ny] of nbs) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const idx = ny * w + nx;
        if (grid[idx] === 0 && !isExternalBg[idx]) {
          isExternalBg[idx] = 1;
          queue.push(idx);
        }
      }
    }
  }

  // 3. For any non-external-bg pixel:
  // If isProtectedPixel(x, y) is true: keep white detail (face, eye, water stream, arrow gap)
  // If isProtectedPixel(x, y) is false: fill solid black (hair, mane, horns, saree, body mass)
  const outputData = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (isExternalBg[idx] === 1) {
        outputData[idx] = 255; // White background
      } else if (grid[idx] === 1) {
        outputData[idx] = 0; // Black stroke
      } else {
        // Internal hole / cavity
        if (config.isProtectedPixel && config.isProtectedPixel(x, y)) {
          outputData[idx] = 255; // Keep white detail
        } else {
          outputData[idx] = 0; // Fill solid black
        }
      }
    }
  }

  // 4. Smooth & Vectorize with high fidelity
  const smoothed = await sharp(outputData, { raw: { width: w, height: h, channels: 1 } })
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .blur(0.8)
    .threshold(128)
    .resize(1024, 1024, { kernel: 'lanczos3' })
    .threshold(128)
    .toFormat('png')
    .toBuffer();

  return new Promise((resolve, reject) => {
    potrace.trace(smoothed, {
      color: 'currentColor',
      threshold: 128,
      optTolerance: 0.5,
      turdSize: config.turdSize || 12,
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
  <!-- ${config.name.toUpperCase()} (Selective Solid Micro-Cut: Solid Masses + Protected Face/Gaps) -->
  <path d="${pathMatch[1]}" fill="currentColor" fill-rule="evenodd" />
</svg>
`;
      const outPath = path.join(outputDir, `${config.id}.svg`);
      fs.writeFileSync(outPath, cleanSvg, 'utf8');
      console.log(`✓ Generated ${config.id}.svg (Selective Solid Micro-Cut)`);
      resolve();
    });
  });
}

async function main() {
  console.log('Generating all 12 Selective Solid Micro-Cut Icons...');
  for (const cfg of iconConfigs) {
    await processIcon(cfg);
  }
  console.log('All 12 Selective Solid Micro-Cut Icons successfully generated!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
