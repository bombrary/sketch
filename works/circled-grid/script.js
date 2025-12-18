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

  const cols = 12;
  const rows = 15;

  const margin = min(width, height) * 0.06;
  const gap = min(width, height) * 0.01;

  const maxCellW =
    (width - margin * 2 - gap * (cols - 1)) / cols;
  const maxCellH =
    (height - margin * 2 - gap * (rows - 1)) / rows;

  const cell = min(maxCellW, maxCellH);
  const r = cell * 0.5;

  const gridW = cell * cols + gap * (cols - 1);
  const gridH = cell * rows + gap * (rows - 1);

  const offsetX = (width - gridW) / 2;
  const offsetY = (height - gridH) / 2;

  noStroke();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = offsetX + x * (cell + gap) + r;
      const cy = offsetY + y * (cell + gap) + r;

      const vertical = random() < 0.5;
      const stripes = int(random(4, 9));
      const colors = shuffle([...palette]).slice(0, 3);

      drawStripedCircle(cx, cy, r, vertical, stripes, colors);
    }
  }
}

function drawStripedCircle(cx, cy, r, vertical, stripes, colors) {
  push();
  translate(cx, cy);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(0, 0, r, 0, TAU);
  drawingContext.clip();

  if (vertical) {
    const w = (r * 2) / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random(colors));
      rect(-r + i * w, -r, w + 1, r * 2);
    }
  } else {
    const h = (r * 2) / stripes;
    for (let i = 0; i < stripes; i++) {
      fill(random(colors));
      rect(-r, -r + i * h, r * 2, h + 1);
    }
  }

  drawingContext.restore();

  noFill();
  stroke(30, 40);
  strokeWeight(1);
  ellipse(0, 0, r * 2);

  pop();
}
