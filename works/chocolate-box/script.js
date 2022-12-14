let palette;
const frameMax = 200;
let frame = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  //palette = ['#453C67', '#6D67E4', '#46C2CB', '#F2F7A1'].map((c) => color(c));
  palette = ['#A77979', '#553939', '#704F4F'].map((c) => color(c));
  background('#472D2D');
}

function draw() {
  noStroke();
  const rectNum = 5;
  const lenMax = min(width, height)/2;
  const rectLen = lenMax / rectNum;
  const xsp = (width - rectLen * rectNum * 2)/2;
  const ysp = (height - rectLen * rectNum * 2)/2;
  push();
  stroke('red');
  pop();
  if (frame < frameMax) {
    fillUp(xsp, ysp, rectNum, rectNum, rectLen, [1/2]);
    fillUp(xsp + rectNum*rectLen, ysp, rectNum, rectNum, rectLen, [1/3, 2/3]);
    fillUp(xsp, ysp + rectNum*rectLen, rectNum, rectNum, rectLen, [1/4, 2/4, 3/4]);
    fillUp(xsp + rectNum*rectLen, ysp + rectNum*rectLen, rectNum, rectNum, rectLen, [1/5, 2/5, 3/5, 4/5]);
    frame++;
  } else {
    noLoop();
  }
}

const fillUp = (xstart, ystart, row, col, rectLen, ratioArr) => {
  const w = rectLen;
  const h = rectLen;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
    const x = xstart + j * rectLen;
    const y = ystart + i * rectLen;
    const [t0, t1, t2] = [random(ratioArr), random(ratioArr), random(ratioArr)];
    const num = random(4);
    fill(randomColor(palette));
    if (num < 1) {
      triangle(x + t0*w, y, x,     y + t1*h, x + w,    y + t2*h);
    } else if (num < 2) {
      triangle(x + t0*w, y, x,     y + t1*h, x + t2*w, y + h);
    } else if (num < 3) {
      triangle(x + t0*w, y, x + w, y + t2*h, x + t2*w, y + h);
    } else {
      triangle(x + t2*w, y + h, x, y + t1*h, x + w,    y + t2*h);
    }
    }
  }
}

const randomColor = (palette) => {
  const t = random(palette.length);
  const idx = constrain(floor(t), 0, palette.length - 2);
  return lerpColor(palette[idx], palette[idx + 1], t);
};
