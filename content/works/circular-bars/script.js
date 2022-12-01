let width, height;
let r = 800;
const dr = 100;
const barMax = 100;
const N = 400;
let sep;


function setup() {
  width = windowWidth;
  height = windowHeight;
  sep = TWO_PI / N;

  createCanvas(width, height);
  background('#005b98');
}

function draw() {
    translate(width / 2, height / 2);

    if (r <= 0) {
      noStroke();
      fill('white');
      ellipse(0, 0, 2*dr, 2*dr);
      return;
    }

    const bars = createRandomBar(N, 0, barMax);
    let theta = 0;
    bars.forEach((bar) => { 
      fill(255);
      stroke('orange');
      drawBar(r, theta, sep, bar);
      theta += sep;
    });
    r -= dr;
}

const drawBar = (r, theta, sep, bar) => {
  const vs_polar = [
    [r, theta],
    [r + bar, theta],
    [r + bar, theta + sep],
    [r, theta + sep],
  ]

  beginShape();
  vs_polar.map((v) => polarToCartesian(...v))
   .forEach((v) => vertex(...v));
  endShape();
};

const polarToCartesian = (r, th) =>
  [r * cos(th), r * sin(th)];

const createRandomBar = (N, m, M) =>
  Array.from({ length: N }, () => ((M - m) * Math.random() + m));
