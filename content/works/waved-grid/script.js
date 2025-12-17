const palette = [
  "#EBE1D1",
  "#41644A",
  "#0D4715",
  "#E9762B",
  "#E67E22",
  "#628141",
  "#8BAE66",
  "#EBD5AB"
];

const BIG = 3;

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

  for (let by = 0; by < ceil(rows / BIG); by++) {
    for (let bx = 0; bx < ceil(cols / BIG); bx++) {

      const bigIndex = bx + by * 1000;

      const vertical = random() < 0.5;
      const stripeMin = int(random(3, 6));
      const stripeMax = stripeMin + int(random(2, 4));
      const colorSet = shuffle([...palette]).slice(0, 3);

      const rotation = random(-PI / 12, PI / 12); // ±15°

      const centerX =
        offsetX +
        (bx * BIG + BIG / 2) * (cell + gap) -
        gap / 2;

      const centerY =
        offsetY +
        (by * BIG + BIG / 2) * (cell + gap) -
        gap / 2;

      push();
      translate(centerX, centerY);
      rotate(rotation);
      translate(-centerX, -centerY);

      for (let y = 0; y < BIG; y++) {
        for (let x = 0; x < BIG; x++) {
          const gx = bx * BIG + x;
          const gy = by * BIG + y;

          if (gx >= cols || gy >= rows) continue;

          const px = offsetX + gx * (cell + gap);
          const py = offsetY + gy * (cell + gap);

          drawStripedSquare(
            px, py, cell,
            vertical,
            stripeMin,
            stripeMax,
            colorSet
          );
        }
      }

      pop();
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
