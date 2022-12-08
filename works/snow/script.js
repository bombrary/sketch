let cvs;
let palette;
const depthMax = 7;

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);
  palette = ['#CFF5E7', '#A0E4CB', '#59C1BD', '#0D4C92'].map((c) => color(c));
  const bgColor = '#EFF5F5';
  background(bgColor);

  noFill();
  stroke(0);

  const L = min(width, height)/2;
  const img = createGraphics(width, height);
  img.translate(width/2, height/2);
  rec(img,
      createVector(0, -L/sqrt(3)),
      createVector(L/2, L/sqrt(3)/2),
      createVector(-L/2, L/sqrt(3)/2),
      0);

  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = 'gray';
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 10;
  image(img, 0, 0);
}


const rec = (img, p1, p2, p3, depth) => {
  if (depth < depthMax) {
    img.noStroke();
    img.stroke(myLerpColor(palette, random()));
    img.fill(myLerpColor(palette, random()));

    img.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

    [[p1, p2], [p2, p3], [p3, p1]].forEach(([q1, q2]) => {
      const v1 = p5.Vector.sub(q2, q1).mult(0.5);
      const v2 = p5.Vector.rotate(v1, -PI/3);
      rec(img,
          q1.copy().add(v2),
          q1.copy().add(v1),
          q1,
          depth + 1);
    });
  }
};

const myLerpColor = (colors, rate) => {
  const len = colors.length;
  const r = rate * len;
  const i = floor(r);
  if (i < 0) {
    return colors[0];
  } else if (i < len - 1) {
    return lerpColor(colors[i], colors[i+1], map(i, i+1, 0, 1, r));
  } else {
    return colors[len - 1];
  }
};
