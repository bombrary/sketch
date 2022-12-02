let entities;
const [fontSizeMin, fontSizeMax] = [0, 100];
const [rMin, rMax] = [0, 100];
const [textDxMin, textDxMax] = [-50, 50];
const [textDyMin, textDyMax] = [-1, 0];
const [circleDxMin, circleDxMax] = [-0.5, 0.5];
const [circleDyMin, circleDyMax] = [-1, 0];


function setup() {
    createCanvas(windowWidth, windowHeight);
    smooth();

    entities = [...createTexts(20), ...createCircles(20)];
}


function draw() {
    background('#181B39');
    for (const e of entities) {
      e.move();
      e.draw();
    }
}


const createCircles = (n) => 
  Array.from({ length: n })
    .map(() => {
      const pos = createVector(random(0, width), random(0, height));
      const r = random(rMin, rMax);
      return new Circle(pos, r)
    });


const createTexts = (n) => 
  Array.from({ length: n })
    .map(() => {
      const pos = createVector(random(0, width), random(0, height));
      const size = random(fontSizeMin, fontSizeMax);
      return new Text(pos, size);
    });


class Text {
  constructor(pos, size) {
    this.pos = pos;
    this.size = size;
  }
  move() {
    this.pos.add(random(textDxMin, textDxMax), random(textDyMin, textDyMax));
    if (this.pos.y < -this.size) {
      this.pos = createVector(random(0, width), height + this.size);
    }
  }
  draw() {
    noFill();
    stroke(255);

    const str = randomString(5);
    textSize(this.size);
    text(str, this.pos.x, this.pos.y);
  }
}


class Circle {
  constructor(pos, r) {
    this.pos = pos;
    this.r = r
  }
  move() {
    this.pos.add(random(circleDxMin, circleDxMax), random(circleDyMin, circleDyMax));
    if (this.pos.y < -this.r) {
      this.pos = createVector(random(0, width), height + this.r);
    }
  }
  draw() {
    noFill();
    stroke(255);

    ellipse(this.pos.x, this.pos.y, this.r);
  }
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')
const randomString = (n) =>
  Array.from({ length: n })
    .map(() => random(characters))
    .join('')
