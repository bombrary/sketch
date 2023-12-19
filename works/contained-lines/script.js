const dang = 0.01;

let shapes = []

class Shape {
  constructor(n, x, y, w, h, ang, dir) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ang = ang;
    this.dir = dir;
    this.n = n
  }
  update() {
    this.ang += this.dir * dang;
    if (this.ang >= TWO_PI) this.ang -= TWO_PI;
  }

  draw() {
    push();
    stroke(0);
    noFill();
    translate(this.x, this.y);
    drawLines(this.n, this.w, this.h, this.ang);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  ang = PI/4;

  const M = 300
  const N = 20;
  for (let i = 0; i < M; i++) {
    const x = random(-width/2, width + width/2);
    const y = random(-height/2, height + height/2);
    const w = random(0, width);
    const h = random(0, height);
    const ang = random(0, TWO_PI);
    const dir = random([-1, 1]);
    shapes.push(new Shape(N, x, y, w, h, ang, dir))
  }
}

function draw() {
  background(255);

  for (const shape of shapes) {
    shape.update();
    shape.draw();
  }
}

const drawLines = (N, W, H, ang) => {
  const xsp = abs(tan(ang) / H);
  for (let i = 0; i < N; i++) {
    const x = map(i, 0, N, -xsp, W + xsp);
    drawLineInRect(W, H, x, ang);
  }
}

const drawLineInRect = (W, H, x, ang) => {

  const p = createVector(x, 0);
  const v0 = createVector(W - p.x, 0 - p.y);
  const v1 = createVector(W - p.x, H - p.y);
  const v2 = createVector(0 - p.x, H - p.y);

  const v = p5.Vector.fromAngle(ang);
  if (0 <= x && x <= W) {
    const t = solve_intersect_wrapper_inner(W, H, p, v, v0, v1, v2, ang);
    if (t === null) return;

    const n0 = p5.Vector.fromAngle(ang);
    n0.setMag(t)

    line(p.x, p.y, p.x + n0.x, p.y + n0.y);
  } else if (x < 0) {
    const [t0, t1] = solve_intersect_wrapper_left(W, H, p, v, v0, v1, v2, ang);
    if (t0 === null || t1 === null) return;

    const n0 = p5.Vector.fromAngle(ang);
    n0.setMag(t0)
    const n1 = p5.Vector.fromAngle(ang);
    n1.setMag(t1)

    line(p.x + n0.x, p.y + n0.y, p.x + n1.x, p.y + n1.y);
  } else if (x > W) {
    const [t0, t1] = solve_intersect_wrapper_right(W, H, p, v, v0, v1, v2, ang);
    if (t0 === null || t1 === null) return;

    const n0 = p5.Vector.fromAngle(ang);
    n0.setMag(t0)
    const n1 = p5.Vector.fromAngle(ang);
    n1.setMag(t1)

    line(p.x + n0.x, p.y + n0.y, p.x + n1.x, p.y + n1.y);
  }
};

const solve_intersect_wrapper_inner = (W, H, p, v, v0, v1, v2, ang) => {
  const ang1 = v0.angleBetween(v1);
  const ang2 = v0.angleBetween(v2);

  if (0 <= ang && ang <= ang1) {
    return solve_intersect(v, p.x, p.y, W, 0, W, H);
  } else if (ang1 <= ang && ang <= ang2) {
    return solve_intersect(v, p.x, p.y, 0, H, W, H);
  } else if (ang2 <= ang && ang <= PI) {
    return solve_intersect(v, p.x, p.y, 0, 0, 0, H);
  } else {
    return null;
  }

}

const solve_intersect_wrapper_left = (W, H, p, v, v0, v1, v2, ang) => {
  const ang1 = v0.angleBetween(v1);
  const ang2 = v0.angleBetween(v2);

  if (0 <= ang && ang <= ang1) {
    return [solve_intersect(v, p.x, p.y, 0, 0, 0, H),
            solve_intersect(v, p.x, p.y, W, 0, W, H)]
  } else if (ang1 <= ang && ang <= ang2) {
    return [solve_intersect(v, p.x, p.y, 0, 0, 0, H),
            solve_intersect(v, p.x, p.y, 0, H, W, H)]
  } else {
    return [null, null];
  }
}

const solve_intersect_wrapper_right = (W, H, p, v, v0, v1, v2, ang) => {
  const ang1 = v0.angleBetween(v1) + PI;
  const ang2 = v0.angleBetween(v2) + PI;

  if (0 <= ang && ang <= ang1) {
    return [null, null];
  } else if (ang1 <= ang && ang <= ang2) {
    return [solve_intersect(v, p.x, p.y, W, 0, W, H),
            solve_intersect(v, p.x, p.y, 0, H, W, H)]
  } else if (ang2 <= ang && ang <= PI) {
    return [solve_intersect(v, p.x, p.y, W, 0, W, H),
            solve_intersect(v, p.x, p.y, 0, 0, 0, H)]
  } else {
    return [null, null];
  }
}

// 直線 (x, y) = (x0, y0) + t*vと
// 直線 (x, y) = (x1, y1) + s*u
// の交点を求める
const solve_intersect = (v, x0, y0, x1, y1, x2, y2) => {
  const u = createVector(x2 - x1, y2 - y1);
  return (u.y*(x1 - x0) - u.x*(y1 - y0)) / (v.x*u.y - v.y*u.x);
};
