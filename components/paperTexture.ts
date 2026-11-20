export function generatePaper(W: number, H: number, seed = 34): Uint8ClampedArray {
  // --- seeded random numbers ---
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const range = (a: number, b: number) => a + rand() * (b - a);

  // --- smooth value noise ---
  const makeNoise = (cell: number) => {
    const gw = Math.ceil(W / cell) + 3;
    const gh = Math.ceil(H / cell) + 3;
    const grid = new Float32Array(gw * gh);
    for (let i = 0; i < grid.length; i++) grid[i] = rand() * 2 - 1;
    return (x: number, y: number) => {
      const gx = x / cell + 1;
      const gy = y / cell + 1;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      let fx = gx - x0;
      let fy = gy - y0;
      fx = fx * fx * (3 - 2 * fx);
      fy = fy * fy * (3 - 2 * fy);
      const a = grid[y0 * gw + x0];
      const b = grid[y0 * gw + x0 + 1];
      const c = grid[(y0 + 1) * gw + x0];
      const d = grid[(y0 + 1) * gw + x0 + 1];
      return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy;
    };
  };

  const k = W / 2400;
  const warpX = makeNoise(260 * k);
  const warpY = makeNoise(260 * k);
  const bump1 = makeNoise(110 * k);
  const bump2 = makeNoise(45 * k);

  const height = new Float32Array(W * H);
  const xw = new Float32Array(W * H);
  const yw = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      xw[i] = x + warpX(x, y) * 20 * k;
      yw[i] = y + warpY(x, y) * 20 * k;
    }
  }

  const creases = (
    count: number,
    len: [number, number],
    wid: [number, number],
    amp: [number, number]
  ) => {
    for (let n = 0; n < count; n++) {
      const cx = range(-100, 2500) * k;
      const cy = range(-100, 1600) * k;
      const th = 0.9 + range(-0.9, 0.9);
      const L = range(len[0], len[1]) * k;
      const wd = range(wid[0], wid[1]) * k;
      const a = range(amp[0], amp[1]) * (rand() < 0.5 ? -1 : 1);
      const c = Math.cos(th);
      const sn = Math.sin(th);
      for (let i = 0; i < W * H; i++) {
        const X = xw[i] - cx;
        const Y = yw[i] - cy;
        const u = X * c + Y * sn;
        const au = Math.abs(u);
        if (au > L * 2.4) continue;
        const v = -X * sn + Y * c;
        const av = Math.abs(v);
        if (av > wd * 12) continue;
        const win = Math.exp(-Math.pow(au / L, 4));
        const ridge = 0.55 * Math.exp(-av / wd) + 0.45 * Math.exp(-av / (wd * 5));
        height[i] += a * win * ridge * wd;
      }
    }
  };

  creases(8, [1000, 2100], [16, 30], [1.1, 1.7]); // long main folds
  creases(14, [450, 1100], [11, 22], [0.8, 1.3]); // medium folds
  creases(14, [180, 520], [7, 14], [0.55, 1.0]); // small folds

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      height[y * W + x] += bump1(x, y) * 3.2 * k + bump2(x, y) * 0.7 * k;
    }
  }

  // --- lighting from the top-left ---
  const lx = -0.6;
  const ly = -0.8;
  const shade = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = (height[i + 1] - height[i - 1]) / 2;
      const gy = (height[i + W] - height[i - W]) / 2;
      shade[i] = gx * lx + gy * ly;
    }
  }
  const sample: number[] = [];
  for (let i = 0; i < shade.length; i += 7) sample.push(Math.abs(shade[i]));
  sample.sort((p, q) => p - q);
  const norm = sample[Math.floor(sample.length * 0.99)] || 1;

  // --- RGBA overlay: white where lit, black where shaded ---
  const out = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    let v = Math.max(-1.5, Math.min(1.5, shade[i] / norm));
    v += (rand() * 2 - 1) * 0.05;
    if (v >= 0) {
      const alpha = Math.min(v * 0.1, 0.2);
      out[i * 4] = 255;
      out[i * 4 + 1] = 255;
      out[i * 4 + 2] = 255;
      out[i * 4 + 3] = alpha * 255;
    } else {
      const alpha = Math.min(-v * 0.4, 0.62);
      out[i * 4] = 0;
      out[i * 4 + 1] = 0;
      out[i * 4 + 2] = 0;
      out[i * 4 + 3] = alpha * 255;
    }
  }
  return out;
}