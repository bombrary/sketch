const flowerPalette = [
  "#F875AA", // ピンク
  "#FDEDED", // 黄色
  "#EDFFF0", // ミント
  "#AEDEFC"  // ラベンダー
];
const bgColor = "#DDEAF3";
const flowers = [];
const num = 450;
const rain = [];
const rainNum = 180;

class Flower {
  constructor() {
    this.x = random(width);
    this.y = random(height * 0.3, height);

    this.type = random(["round", "star", "tulip"]);

    this.size = random(6, 20);
    this.petals = int(random(5, 10));

    this.col1 = color(random(flowerPalette));
    this.col2 = color(random(flowerPalette));

    this.depth = map(this.y, height * 0.3, height, 1.4, 0.5);
    this.angle = random(TAU);
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    const s = this.size * this.depth;

    noStroke();
    fill(this.col1);

    if (this.type === "round") {
      for (let i = 0; i < this.petals; i++) {
        const a = (TAU / this.petals) * i;
        push();
        rotate(a);
        translate(s, 0);
        ellipse(0, 0, s * 0.9, s * 0.4);
        pop();
      }

    } else if (this.type === "star") {
      for (let i = 0; i < this.petals; i++) {
        const a = (TAU / this.petals) * i;
        push();
        rotate(a);
        triangle(0, 0, s, -s * 0.3, s, s * 0.3);
        pop();
      }
    } else if (this.type === "tulip") {
      beginShape();
      vertex(-s * 0.5, 0);
      vertex(0, -s);
      vertex(s * 0.5, 0);
      vertex(0, s * 0.2);
      endShape(CLOSE);
    }

    fill(this.col2);
    circle(0, 0, s * 0.6);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < num; i++) {
    flowers.push(new Flower());
  }
  drawBackground();
  drawFlowers();
}

function draw() {
  for (const f of flowers) {
    f.draw();
  }
}

function drawBackground() {
  background(color(bgColor));
}

function drawFlowers() {
  flowers.sort((a, b) => a.y - b.y);
  for (const f of flowers) {
    f.draw();
  }
}
