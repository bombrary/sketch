let yellowPalette, bluePalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  yellowPalette = ['#f8b12f', '#fae690', '#f7fae8'].map((c) => color(c));
  bluePalette = ['#211a3a', '#22458e', '#63beed'].map((c) => color(c));
}

class Circle {
  constructor(x, y, r, n, sw) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.n = n
    this.sw = sw;
  }

  erase(img) {
    img.imageMode(CENTER);
    img.push();
    {
      img.translate(this.x, this.y);
      img.erase();
      img.ellipse(0, 0, 2*this.r);
      img.noErase();

      const imgFence = createGraphics(2*this.r, 2*this.r);
      for (let i = 0; i < this.n; i++) {
        const x = map(i, -1, this.n, 0, 2*this.r);
        imgFence.stroke(0)
        imgFence.strokeWeight(this.sw);
        imgFence.noFill();
        imgFence.line(x, 0, x, 2*this.r);
      }
      imgFence.drawingContext.globalCompositeOperation = 'destination-in'
      imgFence.noStroke();
      imgFence.fill(255);
      imgFence.ellipse(this.r, this.r, 2*this.r + 2);
      img.image(imgFence, 0, 0);
    }
    img.pop();
  }
}

function draw() {
  background(random(bluePalette));
  noStroke();
  for (let i = 0; i < 100; i++) {
    const x = random(0, width);
    const y = random(0, height);
    const r = random(0, 100);
    push();
    fill(random(yellowPalette));
    translate(x, y);
    ellipse(0, 0, 2*r);
    pop();
  }


  const circles = []
  const rMin = 100;
  const rMax = 200;
  for (let i = 0; i < 20; i++) {
    const x = random(0, width);
    const y = random(0, height);
    let r0 = rMax;
    for (const c of circles) {
      const d = dist(c.x, c.y, x, y);
      r0 = min(d - c.r, r0);
    }
    if (r0 >= 100) {
      const r = random(100, r0);
      circles.push(new Circle(x, y, r, 10, 10));
    }
  }


  const img = createGraphics(width, height);
  img.background(0);

  circles.forEach((c) => {
    c.erase(img);
  });

  image(img, 0, 0);

  for (const c of circles) {
    const lightImg = createGraphics(width, height)
    push();
    lightImg.drawingContext.shadowBlur = 100;
    lightImg.drawingContext.shadowColor = random(yellowPalette);
    lightImg.fill(255);
    lightImg.translate(c.x, c.y);
    lightImg.ellipse(0, 0, 2*c.r);
    lightImg.erase();
    lightImg.ellipse(0, 0, 2*c.r);
    pop();
    image(lightImg, 0, 0);
  }

  const grain = generateGrainImg(-255, 255);
  image(grain, 0, 0);

  noLoop();
}

const generateGrainImg = (cMin, cMax) => {
  const img = createGraphics(width, height);
  const d = img.pixelDensity();
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      for (let k = 0; k < d; k++) {
        for (let l = 0; l < d; l++) {
          const i = 4 * ((y * d + l) * img.width * d + (x * d + k));
          const val = random(0, 128);         img.pixels[i + 0] = val;
          img.pixels[i + 1] = val;
          img.pixels[i + 2] = val;
          img.pixels[i + 3] = 32;
        }
      }
    }
  }
  img.updatePixels();
  return img;
};
