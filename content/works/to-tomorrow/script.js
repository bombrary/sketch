const yellowPalette = ['#FFDD67', '#FFCD38', '#FEFEA4'];
const bluePalette = ['#005b98', '#537188', '#C2DEDC'];
let R;
let Rs;
let fragmentsCircles;
let idxStep0;
let imgs;
let step;
let grain;

class Fragment {
  constructor(R, N, phi, th1, th2) {
    this.R = R;
    this.N = N;
    this.phi = phi;
    this.th1 = th1;
    this.th2 = th2;
  }

  draw(img) {
    img.push();
    {
      img.noStroke();

      img.beginClip();
      drawPolygon(img, this.R, this.N, this.phi);
      img.endClip();

      img.arc(0, 0, 2*this.R, 2*this.R, this.th1, this.th2);
    }
    img.pop();
  }
}

const drawPolygon = (img, R, N, phi) => {
  if (N === Infinity) {
    img.ellipse(0, 0, 2*R, 2*R);
  } else {
    img.beginShape();
    for (let i = 0; i < N; i++) {
      const th = i / N * TWO_PI;
      const x = R * cos(th + phi);
      const y = R * sin(th + phi);
      img.vertex(x, y);
    }
    img.endShape(CLOSE);
  }
};

class FragmentsCircle {
  constructor(R, palette) {
    const N_phi = [[Infinity, random(0, TWO_PI)],
                   [3, random(0, TWO_PI)],
                   [4, random(0, TWO_PI)],
                   [5, random(0, TWO_PI)]];
    const M = 50;
    const angles = Array.from({ length: M }).map(() => random(0, TWO_PI));
    angles.sort((a, b) => a - b);

    this.R = R;
    this.palette = palette;
    this.fragments = pairsLoop(angles).map(([th1, th2]) => {
      const [N, phi] = random(N_phi);
      return new Fragment(R, N, phi, th1, th2);
    });
  }

  draw(img) {
    img.push()
    {
      this.fragments.forEach((fragment) => {
        const col = random(this.palette);
        img.fill(col);
        fragment.draw(img)
      });
    }
    img.pop();
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  R = max(width/2, height/2);
  Rs = [R/6, R/5, R/4, R/3, R/2, R, R * 3/2];
  Rs.reverse();
  idx = 0;
  step = 0;
  idxStep0 = 0;
  fragmentsCircles = Rs.map((R, i) => {
    const palette = (() => {
      if (i % 2 === 0) return yellowPalette;
      else return bluePalette;
    })();
    return new FragmentsCircle(R, palette);
  });
  grain = generateGrainImg(-255, 255);
}


function draw() {
  fill(0);
  noStroke();

  if (step == 0) {
    background(255);
    drawStep1();
    step++;
  } else if (step == 1) {
    drawStep0(idxStep0)
    drawStep1();
    idxStep0++;
    if (idxStep0 >= Rs.length) {
      step++;
    }
  } else if (step == 2) {
    drawStep1();
    step++;
  } else {
    image(grain, 0, 0);
    noLoop();
  }
};

const drawStep0 = (i) => {
  const fragmentsCircle = fragmentsCircles[i];
  const img = createGraphics(2*fragmentsCircle.R, 2*fragmentsCircle.R);

  img.push();
  img.translate(img.width/2, img.height/2);
  fragmentsCircle.draw(img);
  img.pop();

  push();
  {
    const baseImg = createGraphics(width, height);
    baseImg.image(img, (width - img.width)/2, (height - img.height)/2);
    baseImg.filter(BLUR, i/3);
    image(baseImg, 0, 0);
  }
  pop();
};


const drawStep1 = () => {
  const img = createGraphics(width, height);
  const s = map(width, 0, 1366, 0, 4);
  img.fill(0);
  img.noStroke();
  img.translate(width/2, height/4 * 3);
  drawHand(img, s)
  image(img, 0, 0);
}


const pairsLoop = (xs) => {
  const res = [];
  for (let i = 0; i < xs.length; i++) {
    if (i !== xs.length - 1) res.push([xs[i], xs[i + 1]]);
  }
  res.push([xs[xs.length - 1], xs[0]]);
  return res;
};


// Inkscapeで手の画像のパスをなぞってsvgで保存し、
// 以下のsvg2p5で変換
//   https://svg2p5.com/
const drawHand = (img, s) => {
  img.push();
  {
    img.scale(s, s);
    img.beginShape();
    img.vertex(73.686, 77.023);
    img.vertex(27.644, 13.729);
    img.vertex(28.178, -1.238);
    img.vertex(25.506, -14.869);
    img.vertex(30.049, -29.302);
    img.vertex(29.515, -37.320);
    img.vertex(27.644, -38.389);
    img.vertex(23.100, -35.716);
    img.vertex(20.695, -29.302);
    img.vertex(16.686, -24.758);
    img.vertex(14.815, -30.371);
    img.vertex(15.617, -41.062);
    img.vertex(11.875, -52.287);
    img.vertex(8.935, -55.494);
    img.vertex(7.599, -55.227);
    img.vertex(4.391, -52.554);
    img.vertex(5.460, -42.932);
    img.vertex(3.590, -33.311);
    img.vertex(1.986, -34.380);
    img.vertex(1.719, -48.545);
    img.vertex(-0.152, -54.960);
    img.vertex(-1.756, -60.839);
    img.vertex(-3.894, -62.710);
    img.vertex(-6.299, -62.710);
    img.vertex(-8.972, -58.969);
    img.vertex(-10.308, -54.692);
    img.vertex(-10.43, -34.113);
    img.vertex(-14.318, -30.371);
    img.vertex(-20.197, -45.872);
    img.vertex(-21.267, -50.416);
    img.vertex(-24.474, -54.158);
    img.vertex(-26.077, -54.158);
    img.vertex(-30.086, -51.218);
    img.vertex(-30.354, -43.734);
    img.vertex(-27.681, -28.500);
    img.vertex(-27.013, -7.987);
    img.vertex(-34.630, -10.660);
    img.vertex(-41.312, -9.524);
    img.vertex(-42.381, -6.383);
    img.vertex(-39.040, -3.109);
    img.vertex(-36.234, -2.307);
    img.vertex(-32.759, 4.107);
    img.vertex(-23.672, 19.341);
    img.vertex(-12.179, 32.438);
    img.vertex(9.469, 90.435);
    img.vertex(16.151, 120.369);
    img.vertex(73.686, 150.578);
    img.vertex(73.686, 120.578);
    img.endShape(CLOSE);
  }
  img.pop();
};

const generateGrainImg = (cMin, cMax) => {
  const img = createGraphics(width, height);
  const d = img.pixelDensity();
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      for (let k = 0; k < d; k++) {
        for (let l = 0; l < d; l++) {
          const i = 4 * ((y * d + l) * img.width * d + (x * d + k));
          const val = random(0, 128);
          img.pixels[i + 0] = val;
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
