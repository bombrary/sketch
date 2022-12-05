let palette, cvs;
const [wMin, wMax] = [10, 500];
const [hMin, hMax] = [10, 500];

function setup() {
  palette = ['#E8F3D6', '#FCF9BE', '#FFDCA9', '#FAAB78'].map((c) => color(c));

  cvs = createCanvas(windowWidth, windowHeight);
  background(palette[1]);

  const img = createGraphics(width, height);
  img.noStroke();
  img.fill(palette[3]);
  img.circle(width / 2, height / 2, min(width, height));

  blendMode(MULTIPLY);
  for (let i = 0; i < 50; i++) {
    const r = random(0, max(width, height));
    const stAngle = random(0, TWO_PI);
    const enAngle = random(0, TWO_PI);
    const weight = random(0, 20);

    stroke(lerpColor(palette[1], palette[3], random()));
    strokeWeight(weight);
    noFill()
    arc(width / 4, height / 4, r, r, stAngle, enAngle);
    arc(3*width / 4, 3*height / 4, r, r, stAngle, enAngle);

    img.stroke(0);
    img.strokeWeight(weight);
    img.erase();
    img.noFill();
    img.arc(width / 4, height / 4, r, r, stAngle, enAngle);
    img.arc(3*width / 4, 3*height / 4, r, r, stAngle, enAngle);
  }
  image(img, 0, 0);

  blendMode(BLEND);
  const d = pixelDensity();
  for (let i = 0; i < 10; i++) {
    swapPixels(randomInt(0, width - wMin), randomInt(0, height - hMin),
               randomInt(0, width - wMin), randomInt(0, height - hMin),
               randomInt(wMin, wMax), randomInt(hMin, hMax), d);
  }
}

const swapPixels = (x1, y1, x2, y2, w, h, d) => {
  const img1 = createImage(w*d, h*d);
  const img2 = createImage(w*d, h*d);

  img1.copy(cvs, x1, y1, w, h, 0, 0, w*d, h*d);
  img2.copy(cvs, x2, y2, w, h, 0, 0, w*d, h*d);

  image(img1, x2, y2, w, h);
  image(img2, x1, y1, w, h);
}


const randomInt = (minNum, maxNum) => {
  return Math.floor(random(minNum, maxNum));
};
