const palette = [
  "#37353E",
  "#44444E",
  "#715A5A",
  "#D3DAD9",
  "#432323",
  "#2F5755",
  "#5A9690",
  "#E0D9D9"
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

  const cell =
    min(
      (width - margin * 2 - gap * (cols - 1)) / cols,
      (height - margin * 2 - gap * (rows - 1)) / rows
    );

  const r = cell * 0.5;

  const gridW = cell * cols + gap * (cols - 1);
  const gridH = cell * rows + gap * (rows - 1);

  const offsetX = (width - gridW) / 2;
  const offsetY = (height - gridH) / 2;

  const cx0 = width / 2;
  const cy0 = height / 2;
  const maxD = dist(0, 0, cx0, cy0);

  noStroke();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = offsetX + x * (cell + gap) + r;
      const cy = offsetY + y * (cell + gap) + r;

      const d = dist(cx, cy, cx0, cy0);
      const collapse = pow(1 - d / maxD, 2.2);

      drawCollapsedCircle(cx, cy, r, collapse);
    }
  }
}

function drawCollapsedCircle(cx, cy, r, collapse) {
  push();
  translate(cx, cy);

  const stripes = int(map(collapse, 0, 1, 7, 3));
  const vertical = random() < 0.5;
  const colors = shuffle([...palette]).slice(0, 4);

  const cutStart = random(TAU);
  const cutSize = random(collapse * PI * 0.6, collapse * PI);

  drawingContext.save();
  drawingContext.beginPath();

  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const a = (TAU / steps) * i;

    if (
      a > cutStart &&
      a < cutStart + cutSize &&
      random() < collapse
    ) {
      continue;
    }

    const n = noise(
      cos(a) * 1.2 + 20,
      sin(a) * 1.2 + 20
    );

    const rr =
      r * (1 + collapse * (n - 0.5) * 1.1);

    const x = cos(a) * rr;
    const y = sin(a) * rr;

    if (i === 0) drawingContext.moveTo(x, y);
    else drawingContext.lineTo(x, y);
  }

  drawingContext.clip();

  if (vertical) {
    let acc = -r;
    for (let i = 0; i < stripes; i++) {
      const w =
        (r * 2) / stripes *
        random(0.6, 1.4);
      fill(random(colors));
      rect(acc, -r, w + 1, r * 2);
      acc += w;
    }
  } else {
    let acc = -r;
    for (let i = 0; i < stripes; i++) {
      const h =
        (r * 2) / stripes *
        random(0.6, 1.4);
      fill(random(colors));
      rect(-r, acc, r * 2, h + 1);
      acc += h;
    }
  }

  drawingContext.restore();
  pop();
}
