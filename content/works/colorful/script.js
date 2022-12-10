const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890'.split('');
const rNum = 10;
let textNumMin, textNumMax;
let textSizeMin, textSizeMax;

function setup() {
  createCanvas(windowWidth, windowHeight);

  palette = ['rgb(238,217,64)', 'rgb(229,100,37)', 'rgb(241,183,209)', 'rgb(163,221,231)', 'rgb(167, 202, 102)'].map((c) => color(c));

  background(255);

  const rMax = max(width/2, height/2);
  [textNumMin, textNumMax] = [rMax/2.5, rMax/1.5];
  [textSizeMin, textSizeMax] = [rMax/30, rMax/10];
  const rSep = rMax / rNum;

  for (let i = 0; i < rNum; i++) {
    if (i % 2 == 0) {
      const img = createGraphics(width, height);
      img.translate(width/2, height/2);
      drawDonutText(img, rSep * i, rSep, map(i, 0, rNum, textNumMin, textNumMax));
      drawingContext.shadowBlur = map(i, 0, 1, 0, 1.5);
      drawingContext.shadowColor = '#000';
      image(img, 0, 0);
    }
  }
}

const drawDonutText = (img, R, sep, num) => {
  for (let i = 0; i < num; i++) {
    const r = random(R, R + sep);
    const angle = random(0, TWO_PI);

    const t = map(r,
                  0, dist(0, 0, width/2, height/2),
                  0, 1);
    const size = map(ease(t), 0, 1, textSizeMin, textSizeMax);
    img.textSize(size);

    img.noStroke();
    img.fill(random(palette));

    img.textAlign(CENTER, CENTER);
    img.text(random(alphabet), r * cos(angle), r * sin(angle));
  }
}

const ease = (x) => {
return -(Math.cos(Math.PI * x) - 1) / 2;
}
