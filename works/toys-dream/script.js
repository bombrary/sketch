const palette = ['#461959', '#7A316F', '#CD6688', '#AED8CC']

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  const N = 200 * width * height / 900 / 900;
  const R = 50;

  img = createBaseImage(N, R, PI/4);
  image(img, 0, 0)
  background(255, 64);
}

function draw() {
  noLoop();
}


const createBaseImage = (N, R, ang) => {
  const img = createGraphics(width, height);

  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);
    img.push();
    {
      const r = random(10, R);
      const phi = random(-PI, PI);
      img.translate(x, y);

      const num = random([Infinity, 3, 4]);
      const col = color(random(palette));
      const lineNum = map(r, 0, R, 0, 40);
      img.noStroke();
      img.fill(col);
      img.rotate(phi);
      drawPolygon(img, num, r);
      img.translate(random(5, 10), random(5, 10));
      drawLinedPolygon(img, num, r, lineNum, ang, darkenColor(col));
    }
    img.pop();
  }
  return img;
};

const darkenColor = (col) => {
  const darkCol = color(0);

  return lerpColor(darkCol, col, 0.5);
};

const drawPolygon = (img, N, R) => {
  if (N === Infinity) {
    img.ellipse(0, 0, 2*R);
    return
  }

  img.beginShape();
  for (let j = 0; j < N; j++) {
    const ang = TWO_PI / N * j;
    const x = R * cos(ang);
    const y = R * sin(ang);
    img.vertex(x, y);
  }
  img.endShape(CLOSE);
};

const drawLinedPolygon = (img, N, R, lineNum, ang, col) => {
  const L = 2*R
  const baseImg = createGraphics(L, L);

  const lineLenMax = sqrt(2) * L;
  baseImg.stroke(col);
  for (let i = 0; i < lineNum; i++) {
    const x = map(i, 0, lineNum, -L, 2*L);
    baseImg.push();
    baseImg.translate(x, 0);
    baseImg.rotate(ang);
    baseImg.line(0, 0, 0, lineLenMax);
    baseImg.pop();
  }

  baseImg.drawingContext.globalCompositeOperation = 'destination-in'
  baseImg.noStroke();
  baseImg.fill(255);
  baseImg.translate(L/2, L/2);
  drawPolygon(baseImg, N, R);

  img.push();
  img.imageMode(CENTER);
  img.image(baseImg, 0, 0);
  img.pop();
};
