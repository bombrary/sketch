const palette = [
  "#3B0270",
  "#6F00FF",
  "#E9B3FB",
  "#FFF1F1",
  "#000000",
  "#CF0F47",
  "#FF0B55",
  "#FFDEDE"
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
    const vertical = y % 2 === 0; // 行ルール
    for (let x = 0; x < cols; x++) {
      const px = offsetX + x * (cell + gap);
      const py = offsetY + y * (cell + gap);

      const columnColor = palette[x % palette.length]; // 列ルール
      drawStripedSquare(px, py, cell, vertical, columnColor);
    }
  }
}

function drawStripedSquare(x, y, size, vertical, columnColor) {
  const stripes = int(random(5, 9));

  push();
  translate(x, y);

  if (vertical) {
    const w = size / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random() < 0.7 ? columnColor : random(palette));
      rect(i * w, 0, w + 1, size);
    }
  } else {
    const h = size / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random() < 0.7 ? columnColor : random(palette));
      rect(0, i * h, size, h + 1);
    }
  }

  pop();
}
