const flowerPalette = [
  "#B8DB80", // ピンク
  "#F7F6D3", // 黄色
  "#FFE4EF", // ミント
  "#F39EB6"  // ラベンダー
];
const bgColor = "#FEEAC9";
const flowers = [];
const num = 450;
const rain = [];
const rainNum = 180;

class Flower {
  constructor(layer) {
    this.x = random(width);
    this.y = random(height * 0.3, height);

    this.type = random(["round", "star", "tulip"]);

    this.size = random(6, 20);
    this.petals = int(random(5, 10));

    this.col1 = color(random(flowerPalette));
    this.col2 = color(random(flowerPalette));

    this.layer = layer;

    // 深度と描画特性をレイヤーごとに変える
    if (layer === "back") {
      this.depth = random(0.4, 0.8);
    } else if (layer === "mid") {
      this.depth = random(0.8, 1.0);
    } else {
      this.depth = random(1.0, 5.0);
    }

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

  const backCount = num * 0.70;
  const midCount  = num * 0.20;
  const frontCount = num * 0.10;

  for (let i = 0; i < backCount; i++) flowers.push(new Flower("back"));
  for (let i = 0; i < midCount; i++) flowers.push(new Flower("mid"));
  for (let i = 0; i < frontCount; i++) flowers.push(new Flower("front"));

  drawBackground();
}

let step = 0;
function draw() {
  if (step == 0) {
    drawFlowers("back");
    step++;
  } else if (step == 1) {
    console.log(step);
    drawFlowers("mid");
    step++;
  } else {
    console.log(step);
    drawFlowers("front");
    noLoop()
  }
}

function drawBackground() {
  background(color(bgColor));
}

function drawFlowers(layer) {
  const flowersTarget = flowers.filter((e) => { return e.layer == layer; })

  flowersTarget.sort((a, b) => a.depth - b.depth);
  for (const f of flowersTarget) {
    f.draw();
  }

  if (layer == "back") {
    filter(BLUR, 4)
  } else if (layer == "mid") {
    filter(BLUR, 2)
  } else {
    drawingContext.filter = `none`;
  }

}
