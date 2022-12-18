let palette;
const iterMax = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);

  palette = ['#332FD0', '#C147E9', '#00E7FF'].map((c) => {
    const col = color(c);
    col.setAlpha(128);
    return col;
  });

  background(0);
}

function draw() {
  for (let i = 0; i < iterMax; i++) {
    const x = random(0, width);
    const y = random(0, height);

    const [r, g, b, _] = get(x, y);
    const n = floor(random(3, 8));
    if (r < 64 && g < 64 && b < 64) {
      drawPolygon(x, y, 100, 100, n);
    }
  }
}

const drawPolygon = (x, y, w, h, n) => {
  const poly = convexPolygonRandom(n, w, h);
  const col = (() => {
    const t = x / width + random(-0.1, 0.1);
    if (x < width/2) {
      return lerpColor(palette[0], palette[1],
                       map(t, 0, 0.5, 0, 1));
    } else {
      return lerpColor(palette[1], palette[2],
                       map(t, 0.5, 1, 0, 1));
    }
  })();

  push();
  translate(x, y);

  fill(col);
  noStroke();
  poly.draw();

  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'white';
  noFill();
  stroke(col);
  poly.draw();

  pop();
}

class Polygon {
  constructor(positions, width, height) {
    this.positions = positions
    this.width = width;
    this.height = height;
  }

  draw() {
    beginShape();
    this.positions.forEach((pos) => {
      vertex(pos.x, pos.y);
    });
    endShape();
  }
}

const convexPolygonRandom = (N, wMax, hMax) => {
  // Generate random convex polygon
  const X = Array.from({ length: N })
           .map(() => random(0, wMax));
  const Y = Array.from({ length: N })
           .map(() => random(0, hMax));

  const [X1, X2] = splitTwoChains(X);
  const [Y1, Y2] = splitTwoChains(Y);

  const vecXs = shuffle([...pairDiff(X1, true), ...pairDiff(X2, false)]);
  const vecYs = shuffle([...pairDiff(Y1, true), ...pairDiff(Y2, false)]);

  const vecs = Array.from({ length: N })
                    .map((_, i) => createVector(vecXs[i], vecYs[i]))
                    .sort((a, b) => a.heading() - b.heading());


  const pos = createVector(0,0);
  const positions = [pos.copy()];
  vecs.forEach((v) => {
    pos.add(v);
    positions.push(pos.copy());
  });

  // Adjust polygon's position
  const [xMin, xMax] = extreme(positions.map((e) => e.x));
  const [yMin, yMax] = extreme(positions.map((e) => e.y));

  const width = xMax - xMin;
  const height = yMax - yMin;

  const posMid = createVector((xMax + xMin)/2, (yMax + yMin)/2);
  positions.forEach((pos) => pos.sub(posMid));

  return new Polygon(positions, width, height);
};

const extreme = (e) => [min(e), max(e)]

const splitTwoChains = (arr) => {
  const [[vMin, vMax], sorted] = extractExtremeValues(arr);
  
  const [arr1, arr2] = [[vMin], [vMin]];
  sorted.forEach((e) => {
    if (random() < 0.5) arr1.push(e);
    else arr2.push(e);
  });
  arr1.push(vMax);
  arr2.push(vMax);

  return [arr1, arr2];
};

const extractExtremeValues = (arr) => {
  const sorted = [...arr].sort((a,b) => a - b);
  const [valMin, valMax] = [sorted[0], sorted[arr.length-1]];
  const rest = sorted.slice(1, sorted.length-1);
  return [[valMin, valMax], rest];
};

const pairDiff = (arr, reversed) => {
  const res = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (!reversed) res.push(arr[i+1] - arr[i]);
    else res.push(arr[i] - arr[i+1]);
  }
  return res;
};
