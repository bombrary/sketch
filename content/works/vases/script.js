const factor = 2;
const maxXSep = 60;
const maxNCols = 12;

function setup() {
  createCanvas(windowWidth, windowHeight);
  const palette = ['#E14D2A', '#FD841F', '#3E6D9C', '#001253'].map((c) => {
    const col = color(c);
    col.setAlpha(64);
    return col;
  })

  const xSep = min(width / maxNCols, maxXSep);
  const nCols = width / xSep;
  const ySep = xSep * factor;
  const nRows = ceil(height / ySep);
  const xRad = xSep / 2 * 0.5;
  const yRad = xRad/2;

  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nCols; j++) {
      const x = j * xSep + xSep/2;
      const y = i * ySep + ySep/2;
      fill(random(palette));
      const t1 = random(0, 1);
      const t2 = random(0, 1);
      drawShapeBroken(x, y, xRad, yRad, ySep - 2*yRad, t1, t2);
    }
  }
}

const drawShapeBroken = (x, y, xRad, yRad, h, t1, t2) => {
  rectMode(CENTER);
  push();
  translate(x, y);
  translate(0, -h/2);
  for (let i = 0; i < 10; i++) {
    drawingContext.globalCompositeOperation = 'source-over';
    drawingContext.globalCompositeOperation = 'destination-out';
    for (let j = 0; j < 5; j++) {
      rect(random(-1.5*xRad, 1.5*xRad), h/2, random(0, 2*xRad), h + 2*yRad);
    }
    drawingContext.globalCompositeOperation = 'source-over';
    for (let j = 0; j < 4; j++) {
      drawShape(xRad, yRad, h, t1, t2);
    }
  }
  pop();
};

const drawShape = (xRad, yRad, h, t1, t2) => {
  const ctx = drawingContext;

  ctx.beginPath();
  ctx.ellipse(0, 0, xRad, yRad, 0, 0, PI, true);
  const xSkip1 = t1 * h/2;
  const xSkip2 = t2 * h/2;
  ctx.bezierCurveTo(-xRad + xSkip1, h/2, -xRad - xSkip2, h/2, -xRad, h);
  ctx.ellipse(0, h, xRad, yRad, 0, -PI, 0, true);
  ctx.bezierCurveTo(xRad + xSkip2, h/2, xRad - xSkip1, h/2, xRad, 0);
  ctx.fill();
}
