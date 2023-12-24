function setup() {
  createCanvas(windowWidth, windowHeight);
}

const blurStrength = [3, 2, 1];
const bgStrength = [128, 64, 32];

function draw() {
  background('#3D0C11');

  fill('#B4B4B3');
  for (let i = 0; i < 3; i++) {
    if (i === 1) {
      push();
      translate(width, height);
      drawGear(width/2, width/16, 20, 20);
      background(0, 200);
      pop();
    }

    drawCity(100);

    push();
    translate(0, height);
    scale(1, -1);
    drawCity(100);
    pop()


    if (i === 1) {
      drawGear(width/2, width/16, 20, 20);
    }

    filter(BLUR, blurStrength[i]);
    background(0, bgStrength[i]);
  }

  noLoop();
}

const drawCity = (N) => {
  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const w = random(width/64, width/16);
    const h = random(0, myMap(x));
    rect(x, 0, w, h);
  }
};

const myMap = (x) => {
  const X = width / 2;
  const Y = height / 4 * 3;
  const y0 = Y / 4;
  const a = Y / X / X;
  return a * (x - X) * (x - X) + y0;
};


const drawGear = (R, dR, N, M) => {
  const vs = [];
  const dth = 0.01;
  for (let i = 0; i < N; i++) {
    const th0 = TWO_PI / N * i;
    const th1 = TWO_PI / N * (i + 1);
    const thm = (th0 + th1) / 2;

    for (let j = 0; j <= M; j++) {
      const th = map(j, 0, M, th0 + dth, thm - dth)
      vs.push([R*cos(th), R*sin(th)]);
    }
    for (let j = 0; j <= M; j++) {
      const th = map(j, 0, M, thm + dth, th1 - dth)
      vs.push([(R + dR)*cos(th), (R + dR)*sin(th)]);
    }
  }

  beginShape();
  for (const [x, y] of vs) {
    vertex(x, y);
  }
  beginContour();
  for (let i = 0; i < N; i++) {
    const r = R / 2;
    const th = TWO_PI / N * (-i);
    vertex(r*cos(th), r*sin(th));
  }
  endContour();
  endShape(CLOSE);
};
