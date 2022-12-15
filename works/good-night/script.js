const iterMax = 10;
const brushMax = 100;
const circleMax = 20;
let circles;
let yellowBrushes, blueBrushes;
let yellowPalette, bluePalette;
let layerBg, layerFg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  blendMode(BLEND);
  noStroke();

  yellowPalette = ['#f8b12f', '#fae690', '#f7fae8'].map((c) => color(c));
  bluePalette = ['#211a3a', '#22458e', '#63beed'].map((c) => color(c));


  layerBg = createGraphics(width, height);
  layerFg = createGraphics(width, height);

  background(bluePalette[0]);

  blueBrushes = createBrushes(bluePalette, layerFg);
  yellowBrushes = createBrushes(yellowPalette, layerBg);
  circles = Array.from({ length: circleMax })
                 .map(() => new Circle(random(0, width), random(0, height)
                                      ,random(10, 100)));
}

function draw() {
  for (let i = 0; i < iterMax; i++) {
    blueBrushes.forEach((brush) => {
      brush.move();
      brush.draw();
      circles.forEach((circ) => {
        if (brush.collide(circ)) {
          brush.reflect(circ);
        }
      });
      if (brush.t > 1) initBrushRandom(brush, bluePalette);
    });

    yellowBrushes.forEach((brush) => {
      brush.move();
      brush.draw();
      if (brush.t > 1) initBrushRandom(brush, yellowPalette);
    });
  }

  image(layerBg, 0, 0);
  image(layerFg, 0, 0);
}

const createBrushes = (palette, layer) => {
  const brushes =  Array.from({ length: brushMax }).map(() =>
                     new Brush(layer));
  brushes.forEach((brush) => initBrushRandom(brush, palette));
  return brushes;
}

const initBrushRandom = (brush, palette) => {
  brush.init(random(0, width), random(0, height),
            random(-2, 2), random(-2, 2),
            random(0, 10),
            random(palette));
};

class Brush {
  constructor(layer) {
    this.layer = layer;
  }

  init(x, y, vx, vy, r, fillCol) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.rMax = r;
    this.fillCol = fillCol;
    this.t = 0;
  }

  move() {
      this.pos.add(this.vel);
      this.r = this.rMax * ease(this.t);
      this.t += 0.01;
  }

  collide(circle) {
    const d = dist(this.pos.x, this.pos.y, circle.pos.x, circle.pos.y);
    return d < circle.r;
  }

  reflect(circle) {
    const norm = p5.Vector.sub(this.pos, circle.pos).normalize();

    this.pos = p5.Vector.mult(norm, circle.r)
                        .add(circle.pos);

    this.vel.add(p5.Vector.mult(norm, -2*p5.Vector.dot(norm, this.vel)));
  }

  draw() {
    this.layer.noStroke();
    this.layer.fill(this.fillCol);
    this.layer.circle(this.pos.x, this.pos.y, this.r);
  }
}

class Circle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }
}

const ease = (t) => {
  if (t < 0.5) {
    return ease1(map(t, 0, 0.5, 0, 1));
  } else {
    return ease2(map(t, 0.5, 1, 1, 0));
  }
}

const ease1 = (t) => {
  return -(cos(PI * t) - 1) / 2;
}

const ease2 = (t) => {
  return -(cos(PI * t) - 1) / 2;
}
