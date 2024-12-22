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
  woodCol = color('#343131');
  yellowCol = color('#FFF574');
}

function draw() {
  background('#80BCBD');

  const mainImg = createGraphics(width, height);
  drawMoon(mainImg);
  drawTreeMain(mainImg);

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

    img0.fill(yellowCol);

    img0.circle(0, r-R, 2*R);
    img0.drawingContext.globalCompositeOperation = 'destination-in';
    img0.circle(0, R-r, 2*R);

    img0.drawingContext.globalCompositeOperation = 'source-over';
    [...Array(10)].forEach((_, i) => {
      const rr = r / (i + 1)
      const col = random(palette0);
      img0.fill(col);
      img0.circle(0, 0, 2*rr);
    });
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

const drawTreeMain = (img) => {
  const L = height/5;
  img.push();
  {
    img.translate(width/2, height/2);
    img.stroke(woodCol);
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
