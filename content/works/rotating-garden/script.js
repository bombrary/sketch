const flowerPalette = [
  "#6DC3BB",
  "#393D7E",
  "#5459AC",
  "#F2AEBB" 
];

const bgColor = "#EFECE3";
const flowers = [];
const num = 450;

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

    this.baseAngle = random(TAU);
    this.swaySeed = random(1000);

    this.stemLen = random(12, 35) * this.depth;
  }

  draw() {
    const sway =
      sin(frameCount * 0.01 + this.swaySeed) * 0.15;

    push();
    translate(this.x, this.y);
    rotate(this.baseAngle + sway);

    const s = this.size * this.depth;

    // 🌱 茎
    stroke(130, 30, 60, 80 * this.depth);
    strokeWeight(1.2 * this.depth);
    line(0, 0, 0, this.stemLen);

    translate(0, -s * 0.2);

    // 🌼 花びら
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
      vertex(0, s * 0.25);
      endShape(CLOSE);
    }

    // 🌸 中心（少し明るく）
    fill(
      red(this.col2) * 1.05,
      green(this.col2) * 1.05,
      blue(this.col2) * 1.05,
      90
    );
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
}

function draw() {
  drawBackground();
  drawFlowers();
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
