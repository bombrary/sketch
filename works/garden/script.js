const flowerPalette = [
  "#FF8383", // ピンク
  "#FFF574", // 黄色
  "#A1D6CB", // ミント
  "#A19AD3"  // ラベンダー
];
const bgColor = '#F6D6D6';
const flowers = [];
const num = 450;

class Flower {
  constructor() {
    this.x = random(width);
    this.y = random(height * 0.3, height); // 地面だけ

    this.size = random(6, 20);
    this.petals = int(random(5, 10));

    this.col1 = color(random(flowerPalette));
    this.col2 = color(random(flowerPalette));

    this.depth = map(this.y, height * 0.3, height, 0.5, 1.4);
    this.angle = random(TAU);
  }

  draw() {
    push();
    translate(this.x, this.y);

    const s = this.size * this.depth;

    noStroke();
    fill(this.col1);

    for (let i = 0; i < this.petals; i++) {
      const a = (TAU / this.petals) * i;

      push();
      rotate(a);
      translate(s, 0);
      ellipse(0, 0, s * 0.9, s * 0.4);
      pop();
    }

    fill(this.col2);
    circle(0, 0, s * 0.6);

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noLoop();

  for (let i = 0; i < num; i++) {
    flowers.push(new Flower());
  }

  drawBackground();
  drawFlowers();
}

function draw() {
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
