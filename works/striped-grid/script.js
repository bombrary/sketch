const palette = [
  "#001F3D",
  "#ED985F",
  "#F7B980",
  "#E6E6E6",
  "#F3E2D4",
  "#C5B0CD",
  "#415E72",
  "#17313E"
];

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

  const cols = 10;
  const rows = 14;

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
      const px = offsetX + x * (cell + gap);
      const py = offsetY + y * (cell + gap);

      drawStripedSquare(px, py, cell);
    }
  }
}

function drawStripedSquare(x, y, size) {
  const stripes = int(random(4, 10));
  const vertical = random() < 0.5;

  push();
  translate(x, y);

  if (vertical) {
    const w = size / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random(palette));
      rect(i * w, 0, w + 1, size);
    }
  } else {
    const h = size / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random(palette));
      rect(0, i * h, size, h + 1);
    }
  }

  pop();
}
