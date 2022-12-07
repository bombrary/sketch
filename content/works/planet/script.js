let palette, cvs;
let donutImgs;
let RMax;
const RNum = 5;
const period = 40;

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);
  palette = ['#181D27', '#254D32', '#3A7D44', '#69B578', '#D0DB97'].map((c) => color(c));
  RMax = min(width, height) / 2;
  const rectLen = min(width, height) / 3 * 2;

  strokeWeight(10);
  noFill();
  rectMode(CENTER);
  [rectLen*sqrt(2), rectLen, rectLen/3*2, rectLen/2].forEach((len) => {
    stroke(lerpColor(palette[0], palette[2], random(0, 1)));
    rect(width / 2, height / 2, len, len);
  });
  stroke(palette[2]);
  textAlign(CENTER, CENTER);
  textSize(100);
  text("Hello", width/2, height/2);

  const sep = Math.floor(RMax / RNum);
  donutImgs = Array.from({ length: RNum }).map((_, i) =>
    new DonutImg(cvs, sep*(i + 1), sep*i, 0, 0.01*(i+1))
  );
}

function draw() {
  background(lerpColor(palette[0], palette[4], (Math.sin(frameCount/period) + 1) / 2));

  donutImgs.forEach(img => {
    img.update();
    img.draw();
  });
}

const clipDonut = (img, x, y, R, r) => {
  push();
  img.noStroke();
  img.fill(0);
  img.drawingContext.globalCompositeOperation = 'destination-out';
  img.circle(x, y, 2*r);
  img.drawingContext.globalCompositeOperation = 'destination-in';
  img.circle(x, y, 2*R);
  pop();
}

class DonutImg {
  constructor(baseImg, R, r, angle, dangle) {
    const img = createGraphics(width, height);
    img.copy(baseImg, 0, 0, width, height, 0, 0, width, height);

    clipDonut(img, width/2, height/2, R, r);

    img.blendMode(BLEND);
    img.noFill(0);
    img.strokeWeight(random(0, 10));
    img.stroke(lerpColor(palette[0], palette[4], random(0, 1)));
    img.circle(width/2, height/2, 2*R);

    this.img = img;
    this.angle = angle;
    this.dangle = dangle
  }

  update() {
    this.angle += this.dangle;
  }

  draw() {
    push();
    imageMode(CENTER);
    translate(width / 2, height / 2);
    rotate(this.angle);
    image(this.img, 0, 0);
    pop();
  }
}
