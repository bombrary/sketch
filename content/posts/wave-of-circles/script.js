let palette;
let bgColor;

const modifyCol = (hex) => {
  const c = color(hex);
  return color(hue(c), saturation(c)/2, brightness(c) * 2);
};

function setup() {
  colorMode(HSB, 100);
  palette = ['#335c67', '#e09f3e', '#9e2a2b', '#540b0e'].map(modifyCol);
  bgColor = modifyCol('#fff3b0');

  createCanvas(windowWidth, windowHeight);
  background(bgColor);
}

const drawSin = (x0, y0, x1, y1, N, amp, R) => {
  const D = dist(x0, y0, x1, y1);
  const TH = atan2(y1 - y0, x1 - x0);
  push();
  translate(x0, y0);
  rotate(TH);
  for (let i = 0; i < N + 1; i++) {
    const th = TWO_PI/N * i;
    const x = D/N * i;
    const y = amp*sin(th);
    const r = random(R/2, R);
    ellipse(x, y, r);
  }
  pop();
};

class PaletteQueue {
  constructor(palette) {
    this.palette = [...palette];
    shuffle(this.palette)
    this.queue = [...this.palette];
  }
  pop() {
    const col = this.queue.pop()
    if (this.queue.length == 0) {
      shuffle(this.palette)
      this.queue = [...this.palette];
    }
    return col
  }
}

const choosePoints = (sep) => {
  const num = random(4);
  if (num == 0) {
    return [random(-sep, 0),
            random(-sep, height + sep),
            random(width, width + sep),
            random(-sep, height + sep)]
  } else if (num == 1) {
    return [random(width, width + sep),
            random(-sep, height + sep),
            random(-sep, 0),
            random(-sep, height + sep)]
  } else if (num == 2) {
    return [random(-sep, width + sep),
            random(0, -sep),
            random(-sep, width + sep),
            random(height, height + sep)]
  } else {
    return [random(-sep, width + sep),
            random(height, height + sep),
            random(-sep, width + sep),
            random(0, -sep)]
  }
};

function draw() {
  const N = 20;
  const R = 20;
  stroke(32);
  strokeWeight(3);

  const sep = 10;
  positions = [
    [0 - sep, height/2, width/2,  0 - sep],
    [width/2, 0 - sep, width + sep, height/2],
    [width/2, height + sep, width + sep, height/2],
    [0 - sep, height/2, width/2, height + sep],
    choosePoints(sep),
  ].map(([x0, y0, x1, y1]) =>
    [x0 + random(-sep/2, sep/2),
     y0 + random(-sep/2, sep/2),
     x1 + random(-sep/2, sep/2),
     y1 + random(-sep/2, sep/2)]
  );

  const Y = 100;
  const paletteQueue = new PaletteQueue(palette);
  for (const [x0, y0, x1, y1] of positions) {
    const fillCol = paletteQueue.pop();
    fill(fillCol);
    drawSin(x0, y0, x1, y1, N, random(Y/2, Y*2), R);
  }

  noLoop();
}
