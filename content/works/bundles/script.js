const palette = ['#453C67', '#6D67E4', '#46C2CB', '#F2F7A1']

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  const N = 50;
  const L = min(width, height) / 4;
  const dMax = 5

  translate(-L/2, -L/2);
  drawColorRect(L, palette, N, 0);

  push();
  scale(1, 1);
  translate(L, L);
  rec(dMax, L / 2, N);
  pop();

  push();
  scale(-1, -1);
  translate(0, 0);
  rec(dMax, L / 2, N);
  pop();

  push();
  scale(-1, 1);
  translate(0, L);
  rec(dMax, L / 2, N);
  pop();

  push();
  scale(1, -1);
  translate(L, 0);
  rec(dMax, L / 2, N);
  pop();

  noLoop();
}

const rec = (depth, L, N) => {
  if (depth == 0) return;
  drawColorRect(L, palette, N);

  for (const num of chooseTwo([0, 1, 2, 3])) {
    if (num == 0) {
      push();
      scale(1, 1);
      translate(L, L);
      rec(depth - 1, L / 2, N);
      pop();
    } else if (num == 1) {
      push();
      scale(-1, -1);
      translate(0, 0);
      rec(depth - 1, L / 2, N);
      pop();
    } else if (num == 2) {
      push();
      scale(-1, 1);
      translate(0, L);
      rec(depth - 1, L / 2, N);
      pop();
    } else {
      push();
      scale(1, -1);
      translate(L, 0);
      rec(depth - 1, L / 2, N);
      pop();
    }
  }
}

const chooseTwo = (nums) => {
  const shuffled = shuffle(nums);
  return [shuffled[0], shuffled[1]];
};

const drawColorRect = (L, palette, N) => {
  push();

  drawColorLine(0, 0, L, 0, palette, N);
  drawColorLine(L, 0, L, L, palette, N);
  drawColorLine(L, L, 0, L, palette, N);
  drawColorLine(0, L, 0, 0, palette, N);
  pop();
};

const drawColorLine = (x1, y1, x2, y2, palette, N) => {
  const p1 = createVector(x1, y1);
  const p2 = createVector(x2, y2);
  const l = p5.Vector.dist(p2, p1);
  const v = p5.Vector.sub(p2, p1).normalize();

  noFill();

  for (let i = 0; i < N; i++) {
    const pm1 = p5.Vector.add(p1, p5.Vector.mult(v, l/3).rotate(random(-PI/8, PI/8)));
    const pm2 = p5.Vector.add(p2, p5.Vector.mult(v, -l/3*2).rotate(random(-PI/8, PI/8)));

    stroke(random(palette));
    strokeWeight(3);
    bezier(p1.x, p1.y,
           pm1.x, pm1.y,
           pm2.x, pm2.y,
           p2.x, p2.y);
  }
};
