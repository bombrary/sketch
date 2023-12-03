function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#45474B');

  drawRandomGears(20, min(width/2, height/2) * 0.5);

  push();
  {
    translate(0, height);
    fill(255);
    noStroke();
    const R = min(width/2, height/2) * 1.5;
    drawGear(R, R/10, 20, 5);
  }
  pop();

  push();
  {
    translate(width, height);
    fill(0);
    noStroke();
    const R = min(width/2, height/2);
    drawGear(R, R/10, 20, 5);
  }
  pop();

  noLoop();
}

const drawRandomGears = (N, R) => {
  for (let i = 0; i < N; i++) {
    const num = random([0, 1, 2, 3]);
    const [x, y] = (() => {
      if (num == 0) {
        return [random(0, width), 0];
      } else if (num == 1) {
        return [random(0, width), height];
      } else if (num == 2) {
        return [0, random(0, height)];
      } else if (num == 3) {
        return [width, random(0, height)];
      }
    })();
    const r = random(10, R);
    push();
    {
      translate(x, y);
      if (random([0, 1]) == 0) {
        fill(0);
      } else {
        fill(255);
      }
      noStroke();
      drawGear(r, r/10, 20, 5);
    }
    pop();
  }
}

const drawGear = (R, dR, N, M) => {
  const vs = []
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
