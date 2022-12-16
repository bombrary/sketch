const depthMax = 5;
let curblendMode;
let palette;
let sel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  palette = ['#EB455F', '#4B56D2', '#FED049'].map((c) => {
    const col = color(c);
    col.setAlpha(64);
    return col;
  });

  sel = createSelect();
  sel.position(10, 10);
  sel.option('BLEND');
  sel.option('SCREEN');
  sel.option('SOFT_LIGHT');
  sel.changed(() => {
    const val = sel.value();
    if (val === 'BLEND') curBlendMode = BLEND;
    else if (val === 'SCREEN') curBlendMode = SCREEN;
    else if (val === 'SOFT_LIGHT') curBlendMode = SOFT_LIGHT;
    else curBlendMode = BLEND;
    redraw();
  });

  curBlendMode = BLEND;
  redraw();
  noLoop();
}

function draw() {
  clear();

  blendMode(curBlendMode);

  noStroke();

  translate(0, height/2);
  push();
  translate(width/4, 0);
  fill(palette[0]);
  for (let i = 0; i < 10; i++) {
    drawShape(50, 3);
  }
  fill(palette[1]);
  translate(width/4, 0);
  for (let i = 0; i < 10; i++) {
    drawShape(50, 4);
  }
  fill(palette[2]);
  translate(width/4, 0);
  for (let i = 0; i < 10; i++) {
    drawShape(50, 5);
  }
  pop();
}

const drawShape = (radius, rotNum) => { 
  beginShape();
  for (let i = 0; i < rotNum; i++) {
    const ang1 = TWO_PI/rotNum * i;
    const ang2 = TWO_PI/rotNum * (i + 1);
    const x1 = radius * cos(ang1);
    const y1 = radius * sin(ang1);
    const x2 = radius * cos(ang2);
    const y2 = radius * sin(ang2);
    rec(createVector(x1, y1),
        createVector(x2, y2),
        0);
  }
  endShape(CLOSE);
}

// Koch curve-like drawing
const rec = (pos1, pos2, depth) => {
  if (depth >= depthMax) {
    return;
  }

  const vorig = p5.Vector.sub(pos2, pos1);
  const v = vorig.copy().normalize();
  const n = p5.Vector.rotate(v, -HALF_PI);
  
  //const [t1, t2, t3] = [1/3, 1/2, 2/3];
  const [t1, t2, t3] = [random(), random(), random()].sort();
  const l = vorig.mag()/3 * sqrt(3)/2;

  const posMid1 = p5.Vector.lerp(pos1, pos2, t1);
  const posMid2 = p5.Vector.lerp(pos1, pos2, t2)
                           .add(n.mult(l));
  const posMid3 = p5.Vector.lerp(pos1, pos2, t3);

  vertex(pos1.x, pos1.y);
  rec(pos1, posMid1, depth + 1);
  rec(posMid1, posMid2, depth + 1);
  rec(posMid2, posMid3, depth + 1);
  rec(posMid3, pos2, depth + 1);
};
