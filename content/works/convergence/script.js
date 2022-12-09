const rectSep = 10;
const rectNum = 40;
const tileNum = 50;
const tileSep = 2;

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);
  const palette1 = ['#E97777', '#FF9F9F', '#FFACC7'].map((c) => color(c));
  const palette2 = ['#FCDDB0', '#FFFAD7', '#FFB9B9', '#FFDDD2'].map((c) => color(c));

  push();
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'black';

  const tileLen = width / tileNum;
  for (let i = 0; i < ceil(width/tileLen); i++) {
    for (let j = 0; j < ceil(height/tileLen); j++) {
      const x = (tileLen + tileSep) * i;
      const y = (tileLen + tileSep) * j;

      noStroke();
      fill(random(palette2));
      rect(x, y, tileLen, tileLen);
    }
  }
  pop();

  background(255,255,255,64);

  const rectWidth = width / rectNum - rectSep;
  const img = createGraphics(width, height);
  for (let i = 0; i < rectNum; i++) {
    const x = (rectWidth + rectSep) * i;
    const t = i / rectNum;
    const rectHeight = 1.5*ease(1-t) * height;
    img.rectMode(CENTER);
    img.push();
    img.blendMode(SCREEN);
    img.translate(x, height/2);
    img.rotate(randomGaussian(0, 1.5*ease(t)));

    img.noStroke();
    img.fill(random(palette1));
    img.rect(0, 0, rectWidth, rectHeight);

    img.stroke(random(palette1));
    img.blendMode(BLEND);
    img.strokeWeight(10);
    img.point(0, 0);

    img.pop();
  }

  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'black';
  image(img, 0, 0)
}

const ease = (t) => {
  return t * t;
}
