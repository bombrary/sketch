const vs = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  vTexCoord = aTexCoord;
}
`;

const fs = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D uTex;
uniform float uPhi;
uniform vec2 uCenter;
uniform float uPi;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  uv.x += 0.005*sin((0.5 - uv.y) / 0.5 * 2.0*uPi)*sin((0.5 - uv.y) / 0.0625 * 2.0*uPi);

  gl_FragColor = texture2D(uTex, uv);
}
`;

let theShader;
let palette0, woodCol, yellowCol;

function setup() {
  createCanvas(windowWidth, windowHeight);
  theShader = createShader(vs, fs);
  palette0 = ['#343131', '#A04747', '#D8A25E', '#E85C0D'].map((c) => color(c));
  palette1 = ['#7C00FE', '#F9E400', '#FFAF00', '#F5004F'].map((c) => color(c));
  palette2 = ['#BFECFF', '#CDC1FF', '#FFF6E3', '#FFCCEA'].map((c) => color(c));
  woodCol = color(255);
  yellowCol = color('#FFF574');
}

function draw() {
  background('#0B192C');

  const woodCol = color("#000");

  const mainImg = createGraphics(width, height);
  drawBackground(mainImg);
  drawBubbles(mainImg, width, height, 100, 1, 10);

  drawMoon(mainImg);
  [...Array(4)].forEach((_, i) => { 
    drawTreeMain(mainImg, palette1[i]);
  });

  mainImg.erase();
  mainImg.rect(0, height/2, width, height / 2);

  image(mainImg, 0, 0)


  const mirrorImg = createGraphics(width, height, WEBGL);
  drawMirror(mainImg, mirrorImg);
  push();
  translate(0, height);
  scale(1, -1);
  image(mirrorImg, 0, 0);
  pop();

  drawHorizon()

  noLoop();
}

function drawBackground(img) {
  const M = 50;
  const SEP = height / M;
  const C0 = color('#000000');
  const C1 = color('#ff0000');
  [...Array(M)].forEach((_, i) => {
    const x = 0;
    const y = SEP * i;
    const col = lerpColor(C0, C1, i / M);
    const h = height - y;
    img.noStroke();
    img.fill(col);
    img.push();
    img.translate(x, y);
    img.rect(0, 0, width, h);
    img.pop();
  });
}

function drawMoon(img) {
  const X = random(0, width / 2);
  const Y = random(0, height / 2);
  const r = 50;
  const R = 200;
  const th = random(0, TWO_PI);
  const img0 = createGraphics(width, height);
  const s = random(0.5, 1.5);

  img0.push();
  {
    img0.noStroke();
    img0.translate(X, Y);
    img0.scale(s, s);
    img0.rotate(th);

    img0.drawingContext.shadowBlur = 100;
    img0.drawingContext.shadowColor = 'white';
    img0.circle(0, 0, R);
  }
  img0.pop();

  img.image(img0, 0, 0);
}


const drawMirror = (sourceImg, targetImg) => {
  targetImg.shader(theShader);
  theShader.setUniform('uTex', sourceImg);
  theShader.setUniform('uCenter', [0.5, 0.5]);
  theShader.setUniform('uPhi', random(-PI, PI));
  theShader.setUniform('uPi', PI);
  targetImg.rect(0, 0, width, height)
};

const drawHorizon = () => {
  push();
  {
    noStroke();
    fill(255, 0);
    rect(0, height/2, width, height / 2);

    stroke(woodCol);
    line(0, height/2, width, height/2);
  }
  pop();
}

const drawTreeMain = (img, col) => {
  const L = height/5;
  img.push();
  {
    img.translate(width/2, height/2);
    img.stroke(col);
    img.strokeWeight(5);
    img.noFill();
    drawTree(img, 10, L, L/2);
  }
  img.pop();
};

const drawTree = (img, depth, L, firstL) => {
  if (depth <= 0) return;

  if (firstL !== 0) {
    L = firstL;
  }
  img.line(0, 0, 0, -L);


  const N = 2;
  const getC = () => random(0.3, 0.8);
  img.push();
  {
    img.translate(0, -L);
    const ang = random(-PI/8, 0);
    const c = getC();
    img.rotate(ang);
    img.scale(c);
    drawTree(img, depth - 1, L, 0);
  }
  img.pop();

  img.push();
  {
    img.translate(0, -L);
    const ang = random(0, PI/8);
    const c = getC();
    img.rotate(ang);
    img.scale(c);
    drawTree(img, depth - 1, L, 0);
  }
  img.pop();

  img.push();
  {
    img.translate(0, -L);
    const ang = random(-PI/8, PI/8);
    const c = getC();
    img.rotate(ang);
    img.scale(c);
    drawTree(img, depth - 1, L, 0);
  }
  img.pop();
};

const drawBubbles = (img, w, h, N, rMin, rMax) => {
  img.noStroke();

  [...Array(N)].forEach((_, i) => {
    const r = random(rMin, rMax);
    const x = random(0, img.width);
    const y = random(0, img.height);
    const col = color("#fff");
    col.setAlpha(100);

    img.drawingContext.shadowColor = 'white';
    img.fill(col);

    img.drawingContext.shadowBlur = 50;
    img.circle(x, y, r);
    img.drawingContext.shadowBlur = 25;
    img.circle(x, y, r)
    img.drawingContext.shadowBlur = 5;
    img.circle(x, y, r);
    img.drawingContext.shadowBlur = 0;
  });
}
