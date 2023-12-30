const yellowPalette = ['#FFDD67', '#FFCD38', '#FEFEA4'];
const bluePalette = ['#005b98', '#537188', '#C2DEDC'];
let R;
let Rs = [];
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
    push();
    {
      img.noStroke();
      if (this.N === Infinity) {
        img.ellipse(0, 0, 2*this.R, 2*this.R);
      } else {
        img.beginShape();
        for (let i = 0; i < this.N; i++) {
          const th = i / this.N * TWO_PI;
          const x = this.R * cos(th + this.phi);
          const y = this.R * sin(th + this.phi);
          img.vertex(x, y);
        }
        img.endShape(CLOSE);
      }
    }
    pop();
  }

  mask(img, globalCompositeOperation) {
    img.drawingContext.globalCompositeOperation = globalCompositeOperation;
    const dth = 0.005;
    img.arc(0, 0, 2*this.R, 2*this.R, this.th1 - dth, this.th2 + dth);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  R = max(width/2, height/2);
  Rs = [R * 3 / 2, R, R/2, R/3, R/4, R/5, R/6];
  idx = 0;
  imgs = Rs.map((r, i) => {
    const col = (() => {
      if (i % 2 === 0) return yellowPalette;
      else return bluePalette;
    })();

    return createFragmentsImg(r, col);
  });
  step = 0;
  idxStep0 = 0;

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
  const col = (() => {
    if (i % 2 === 0) return yellowPalette;
    else return bluePalette;
  })();

  const r = Rs[i];
  const img =  createFragmentsImg(r, col);
  const baseImg = createGraphics(width, height);
  baseImg.image(img, (width - img.width)/2, (height - img.height)/2);
  baseImg.filter(BLUR, i/3);

  image(baseImg, 0, 0);
};


const drawStep1 = () => {
  const img = createGraphics(width, height);
  const s = map(width, 0, 1366, 0, 4);
  img.fill(0);
  img.noStroke();
  img.translate(width/2, height/4 * 3);
  img.scale(s, s);
  drawHand(img)
  image(img, 0, 0);
}

const createFragmentsImg = (R, palette) => {
  const N_phi = [[Infinity, random(0, TWO_PI)],
                 [3, random(0, TWO_PI)],
                 [4, random(0, TWO_PI)],
                 [5, random(0, TWO_PI)]];
  const angles = Array.from({ length: 50 }).map(() => random(0, TWO_PI));
  angles.sort((a, b) => a - b);

  const fragments = pairsLoop(angles).map(([th1, th2]) => {
    const [N, phi] = random(N_phi);
    return new Fragment(R, N, phi, th1, th2);
  });

  const mainImg = createGraphics(2*R, 2*R);
  mainImg.imageMode(CENTER);
  for (const fragment of fragments) {
    const img = createGraphics(2*fragment.R, 2*fragment.R)
    const col = random(palette);
    img.fill(col);
    img.translate(fragment.R, fragment.R);
    fragment.draw(img)
    fragment.mask(img, 'destination-in');
    mainImg.image(img, R, R);
  }
  return mainImg;
};

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
const drawHand = (img) => {
  img.push();
  {
    img.translate(-110, -163);
    img.beginShape();
    img.vertex(183.68561,240.02324);
    img.vertex(137.6438,176.72871);
    img.vertex(138.17835,161.76162);
    img.vertex(135.50565,148.13087);
    img.vertex(140.04923,133.69832);
    img.vertex(139.51469,125.68023);
    img.vertex(137.6438,124.61113);
    img.vertex(133.10022,127.28383);
    img.vertex(130.6948,133.69832);
    img.vertex(126.68576,138.2417);
    img.vertex(124.81487,132.62924);
    img.vertex(125.61668,121.93846);
    img.vertex(121.8749,110.71314);
    img.vertex(118.93494,107.5059);
    img.vertex(117.59859,107.77317);
    img.vertex(114.39136,110.44587);
    img.vertex(115.46043,120.06757);
    img.vertex(113.58955,129.68927);
    img.vertex(111.98593,128.6202);
    img.vertex(111.71866,114.45491);
    img.vertex(109.84778,108.04044);
    img.vertex(108.24416,102.16051);
    img.vertex(106.106,100.28963);
    img.vertex(103.70058,100.28963);
    img.vertex(101.02788,104.0314);
    img.vertex(99.691533,108.3078);
    img.vertex(99.156992,128.8874);
    img.vertex(95.682489,132.62924);
    img.vertex(89.802561,117.12761);
    img.vertex(88.733483,112.58402);
    img.vertex(85.526247,108.84225);
    img.vertex(83.922631,108.84225);
    img.vertex(79.913587,111.78222);
    img.vertex(79.646319,119.26576);
    img.vertex(82.319012,134.50013);
    img.vertex(82.987186,155.01306);
    img.vertex(75.370007,152.34036);
    img.vertex(68.688267,153.47626);
    img.vertex(67.61919,156.61667);
    img.vertex(70.960058,159.89073);
    img.vertex(73.766388,160.69254);
    img.vertex(77.240894,167.10701);
    img.vertex(86.328056,182.34137);
    img.vertex(97.820645,195.43758);
    img.vertex(119.46948,253.43506);
    img.vertex(126.15122,283.36925);
    img.vertex(183.68561,283.57801);
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
