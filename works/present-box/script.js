"use strict";

let palette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  palette = ['#DC3535', '#FFE15D', '#82CD47', '#fff'].map((c) => {
    const col = color(c);
    col.setAlpha(65);
    return col;
  });
}

function draw() {
  background(0);
  noLoop();

  const l = min(min(width, height), 720);
  const a = l/4;
  const b = l/4;
  const c = l/4;

  const cubicImg = createCuboidImg(50, a, b, c);
  const bgImg = createGrainImg(width, height, 50, 1, 100);

  image(bgImg, 0, 0);
  image(cubicImg, 0, 0);
}

const createCuboidImg = (N, a, b, c) => {
  const img = createGraphics(width, height, WEBGL);
  const cam = img.createCamera();
  img.setAttributes({ alpha: true });

  cam.ortho();
  cam.move(0,0,0);
  cam.lookAt(0,0,0);
  img.setCamera(cam);

  const img1 = createGrainImg(a, b, 100, 1, 50);
  const img2 = createGrainImg(c, b, 100, 1, 50);
  const img3 = createGrainImg(a, c, 100, 1, 50);

  img.push();
  img.rotateX(-PI/6);
  img.rotateY(-PI/6);
  img.translate(-a/2,-b/2, c/2);
  drawCuboid(img, img1, img2, img3);
  img.pop();

  return img
}

const drawCuboid = (img, img1, img2, img3) => {
  img.push();
  img.image(img1, 0, 0);
  img.pop();

  img.push();
  img.rotateY(HALF_PI);
  img.translate(0, 0, img1.width);
  img.image(img2, 0, 0);
  img.pop();

  img.push();
  img.rotateX(HALF_PI);
  img.translate(0, -img1.height, 0);
  img.image(img3, 0, 0);
  img.pop();

}

const createGrainImg = (w, h, N, rMin, rMax) => {
  const img = createGraphics(w, h)
  img.noStroke();
  img.background(0);

  for (let i = 0; i < N; i++) {
    const r = random(rMin, rMax);
    const x = random(0, img.width);
    const y = random(0, img.height);

    img.drawingContext.shadowColor = 'white';
    img.fill(random(palette));

    img.drawingContext.shadowBlur = 100;
    img.circle(x, y, r);
    img.drawingContext.shadowBlur = 50;
    img.circle(x, y, r)
    img.drawingContext.shadowBlur = 10;
    img.circle(x, y, r);
  }

  // For debug
  //drawFrame(img);

  return img;
}


const drawFrame = (img) => {
  img.noStroke();
  img.fill(255);
  img.circle(img.width/2, img.height/2, 100);

  img.stroke('magenta');
  img.strokeWeight(5);
  img.noFill();
  img.beginShape();
  img.vertex(0,0);
  img.vertex(img.width,0);
  img.vertex(img.width,img.height);
  img.vertex(0,img.height);
  img.endShape(CLOSE);
}
