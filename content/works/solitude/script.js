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

function setup() {
  createCanvas(windowWidth, windowHeight);
  theShader = createShader(vs, fs);
}

function draw() {
  background(255);

  const L = height/5;
  const img = createGraphics(width, height);
  img.push();
  {
    img.translate(width/2, height/2);
    img.stroke(0);
    img.strokeWeight(5);
    img.noFill();
    drawTree(img, 10, L, L/2);
  }
  img.pop();

  image(img, 0, 0)

  push();
  {
    const mirrorImg = createGraphics(width, height, WEBGL);
    mirrorImg.shader(theShader);
    theShader.setUniform('uTex', img);
    theShader.setUniform('uCenter', [0.5, 0.5]);
    theShader.setUniform('uPhi', random(-PI, PI));
    theShader.setUniform('uPi', PI);
    mirrorImg.rect(0, 0, width, height)

    translate(0, height);
    scale(1, -1);
    image(mirrorImg, 0, 0);
  }
  pop();

  push();
  {
    noStroke();
    fill(255, 200);
    rect(0, height/2, width, height / 2);

    stroke(200);
    line(0, height/2, width, height/2);
  }
  pop();

  noLoop();
}

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
