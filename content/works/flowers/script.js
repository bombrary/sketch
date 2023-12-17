const palette = ['#FF90BC', '#FFC0D9', '#F9F9E0', '#8ACDD7']
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
  const N = 100;
  const R = 10;
  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);
    const col = img.get(x, y);
    const num = Math.floor(random(3, 8));
    const r = random(0, R);
    const ang = random(-PI, PI);

    push();
    translate(x, y);
    rotate(ang);
    stroke(col);
    noFill();
    drawWing(num, r);
    pop();
  }

  if (step <= 0) {
    noLoop();
  } else {
    step--;
  }
}

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
