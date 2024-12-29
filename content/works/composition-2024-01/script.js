let palette0, palette1, palette2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  palette0 = ['#640D5F', '#D91656', '#EE66A6', '#FFEB55'].map((c) => color(c));
  palette1 = [ '#EB5B00', '#F5F0CD', '#FBD288' ].map((c) => color(c));
  palette2 = [ '#f8b12f', '#fae690', '#f7fae8' ].map((c) => color(c));
}

function draw() {
  const mainImg = createGraphics(width, height);
  drawMain(mainImg);
  image(mainImg, 0, 0);

  noLoop();
}

const drawMain = (img) => {
  const N = 100;
  const points = [];

  [...Array(N)].forEach((_, i) => {
    const x = map(i, 0, N - 1, 0, width);
    const dy = (() => { 
      if (i == 0 || i == N - 1) {
        return 0
      } else {
        return random(-height / 8, height / 8);
      }
    })();
    const y = height / 2 + dy;
    const p = createVector(x, y);
    points.push(p);
  });

  const img0 = createGraphics(width, height);
  drawImg0(img0);

  img0.erase();
  img0.noStroke();
  img0.beginShape();
  img0.vertex(0, height);
  points.forEach((p) => {
    img0.vertex(p.x, p.y);
  });
  img0.vertex(width, height);
  img0.endShape(CLOSE);

  img.image(img0, 0, 0);

  const img1 = createGraphics(width, height);
  drawImg1(img1);

  img1.erase();
  img1.noStroke();
  img1.beginShape();
  img1.vertex(0, 0);
  points.forEach((p) => {
    img1.vertex(p.x, p.y);
  });
  img1.vertex(width, 0);
  img1.endShape(CLOSE);

  img.image(img1, 0, 0);
};

function makeColors(palette, N) {
  let prev = random(palette);
  const result = [];
  [...Array(N)].forEach((_, i) => {
    const colors = [];
    [...Array(palette.length)].forEach((_, i) => {
      if (palette[i] != prev) {
        colors.push(palette[i]);
      }
    });
    const col = random(colors)
    result.push(col);
    prev = col;
  });
  return result;
}

const drawImg0 = (img) => {
  const R = sqrt(width * width + height * height);
  const X = random(0, width);
  const Y = random(0, height);
  const N = 10;
  const colors = makeColors(palette1, N);
  const SEP = 100;
  const TH = random(-HALF_PI, 0);
  const circlesNum = 200;
  const circlesDiamMin = 30;
  const circlesDiamMax = 300;

  img.background("#211a3a");

  [...Array(N)].forEach((_, i) => {
    const col = colors[i];
    img.noStroke();
    col.setAlpha(128);
    img.fill(col);
    img.push();
    img.rotate(TH);
    img.translate(SEP * i, 0);
    img.rect(0, 0, 2*R, 2*R);
    img.pop();
  });


  [...Array(circlesNum)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const d = dist(x, y, X, Y);
    let diam = map(d, 0, R, circlesDiamMin, circlesDiamMax);
    const col = random(palette2);

    const th = atan2(y, x);
    if (HALF_PI + TH < th && th < HALF_PI) {
      col.setAlpha(64);
      diam *= 0.5;
      img.fill(col);
      myShape(img, x, y, diam, [3, 4]);
    } else {
      col.setAlpha(255);
      img.fill(col);
      myShape(img, x, y, diam, [3, 4, 5]);
    }
  });
};

function myShape(img, x, y, diam, Ns) {
  const r = diam / 2.0;
  const N = random(Ns);
  img.push();
  img.translate(x, y);

  const type = random([0, 1, 2])

  if (N > 0) {
    img.beginShape();
    [...Array(N)].forEach((_, i) => {
      const fact = random(0, 1);
      const x1 = fact * r * cos(TWO_PI / N * i);
      const y1 = fact * r * sin(TWO_PI / N * i);
      img.vertex(x1, y1);
    });
    img.endShape(CLOSE);
  } else {
    img.circle(0, 0, diam);
  }

  img.pop();
}

const drawImg1 = (img) => {
  img.background(palette0[palette0.length - 1]);
  const N = 100;

  [...Array(N)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const diam = map(y, 0, height, 10, 100);
    const col = random(palette0);

    img.stroke(col);
    col.setAlpha(128);

    img.fill(col);
    col.setAlpha(255);

    img.circle(x, y, diam);
  });
};
