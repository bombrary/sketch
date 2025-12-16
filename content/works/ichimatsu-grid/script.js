const palette = [
  "#213448",
  "#547792",
  "#94B4C1",
  "#EAE0CF",
  "#F3E2D4",
  "#434E78",
  "#F7E396",
  "#E97F4A"
];

const BIG = 3; // ← 隠れた大グリッドサイズ

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  drawPoster();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawPoster();
}

function drawPoster() {
  background(245);

  const cols = 12;
  const rows = 15;

  const margin = min(width, height) * 0.06;
  const gap = min(width, height) * 0.015;

  const maxCellW =
    (width - margin * 2 - gap * (cols - 1)) / cols;
  const maxCellH =
    (height - margin * 2 - gap * (rows - 1)) / rows;

  const cell = min(maxCellW, maxCellH);

  const gridW = cell * cols + gap * (cols - 1);
  const gridH = cell * rows + gap * (rows - 1);

  const offsetX = (width - gridW) / 2;
  const offsetY = (height - gridH) / 2;

  noStroke();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      const bx = floor(x / BIG);
      const by = floor(y / BIG);
      const bigIndex = bx + by * 1000;

      randomSeed(bigIndex);

      const vertical = random() < 0.5;
      const stripeMin = int(random(3, 6));
      const stripeMax = stripeMin + int(random(2, 4));

      const colorSet = shuffle([...palette]).slice(0, 3);

      const px = offsetX + x * (cell + gap);
      const py = offsetY + y * (cell + gap);

      drawStripedSquare(
        px, py, cell,
        vertical,
        stripeMin,
        stripeMax,
        colorSet
      );
    }
  }
}

function drawStripedSquare(x, y, size, vertical, minS, maxS, colors) {
  const stripes = int(random(minS, maxS));

  push();
  translate(x, y);

  if (vertical) {
    const w = size / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random(colors));
      rect(i * w, 0, w + 1, size);
    }
  } else {
    const h = size / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random(colors));
      rect(0, i * h, size, h + 1);
    }
  }

  pop();
}
