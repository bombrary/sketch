const palette = ['#B5C99A', '#862B0D', '#FFF9C9', '#FFC95F']
let img;
let step;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  const N = 200 * width * height / 900 / 900;
  const R = 50;
  step = 200 * width * height / 900 / 900;

  img = createBaseImage(N, R);
}

function draw() {
  const N = 10;
  const xs = Array.from({ length: N }, _ => random(0, width));
  xs.sort((a, b) => a - b);
  xs.push(width);

  xs.forEach((x, i) => {
    const xp = (() => {
      if (i == 0) return 0;
      else return xs[i - 1];
    })();
    const W = x - xp;
    const density = random(1, W/8);
    drawMosaic(img, xp, 0, W, height, density);

    stroke(32);
    line(x, 0, x, height);
  });


  noLoop();
}


const myRandom = () => {
  return random([true, false, false, false]);
};

const drawMosaic = (img, x0, y0, W, H, density) => {
  for (let y = y0; y <= y0 + H; y += density) {
    for (let x = x0; x <= x0 + W; x += density) {
      const xm = x + density / 2;
      const ym = y + density / 2;
      const col = img.get(xm, ym);
      fill(col);
      noStroke();
      rect(x, y, density, density);
    }
  }
};

const createBaseImage = (N, R) => {
  const img = createGraphics(width, height);

  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);
    img.push();
    {
      const r = random(0, R);
      const phi = random(-PI, PI);
      img.translate(x, y);

      const num = random([0, 3, 4]);
      if (num == 0) {
        img.ellipse(0, 0, 2*r);
      } else {
        img.fill(random(palette));
        img.rotate(phi);
        drawPolygon(img, num, r);
      }
    }
    img.pop();
  }
  return img;
};

const drawWing = (N, R) => {
  for (let j = 0; j < N; j++) {
    const ang = TWO_PI / N * j;
    const x = R * cos(ang);
    const y = R * sin(ang);
    line(0, 0, x, y);
  }
};

const drawPolygon = (img, N, R) => {
  img.beginShape();
  for (let j = 0; j < N; j++) {
    const ang = TWO_PI / N * j;
    const x = R * cos(ang);
    const y = R * sin(ang);
    img.vertex(x, y);
  }
  img.endShape(CLOSE);
};
