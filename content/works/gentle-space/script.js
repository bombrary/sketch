"use strict";

let step = 0;
let bubbleCount = 20;
const colWipe = '#FA6700';
const colLight = '#FFD8A9';
const colBulb = '#FFFAD7'

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (step === 0) {
    background(16);
    step++;
  } else if (step === 1) {
    const wMin = min(map(width, 0, 1440, 0, 20), 20);
    const wMax = min(map(width, 0, 1440, 0, 40), 40);
    for (let i = 0; i < 10; i++) {
      drawLamp(random(0, width), height/4 + random(-height/4, height/4), random(wMin, wMax));
    }
    step++;
  } else if (step === 2) {
    filter(BLUR, 3);
    step++;
  } else if (step === 3) {
    const wMin = min(map(width, 0, 1440, 0, 40), 40);
    const wMax = min(map(width, 0, 1440, 0, 90), 90);
    for (let i = 0; i < 10; i++) {
      drawLamp(random(0, width), height/2 + random(-height/8, height/8), random(wMin, wMax));
    }
    step++;
  } else if (step === 4) {
    const img = generateBubble();
    image(img, random(0, width), random(0, height));
    bubbleCount--;
    if (bubbleCount === 0) {
      step++;
    }
  } else if (step === 5) {
    const img = generateWipe();
    image(img, 0, 0);
    step++;
  } else if (step === 6) {
    const img = generateGrainImg(-255, 255);
    image(img, 0, 0);
    step++;
  } else {
    noLoop();
  }
}

const generateBubble = () => {
  const R = random(10, 100);
  const img = createGraphics(4*R, 4*R);
  const a = random(16, 32);
  img.noStroke();
  img.fill(255, a);
  img.circle(img.width/2, img.height/2, 2*R);
  img.filter(BLUR, random(2, 8));
  return img;
};

const generateWipe = () => {
  const img = createGraphics(width, height);
  const col = color(colWipe);
  const ctx = img.drawingContext;
  col.setAlpha(64);

  const x = width/2;
  const y = height/2 - height/4;

  img.background(col)
  img.noStroke();

  // a : b = width : height
  // (width/2)^2/a^2 + (height/2)^2/b^2 = 1
  // -> a = sqrt(2)*width, b = sqrt(2)*height
  const a = width/1.2;
  const b = height/1.2;
  img.push();
  ctx.fillStyle = ctx.createRadialGradient(0, 0, 0, 0, 0, a);
  ctx.fillStyle.addColorStop(0, 'rgba(0,0,0,1)');
  ctx.fillStyle.addColorStop(1.0, 'rgba(225,225,225,0)');
  ctx.globalCompositeOperation = 'destination-out';
  img.translate(x, y);
  img.scale(1, b/a);
  img.circle(0, 0, 2*a);
  img.pop();

  img.push();
  const h = height/2*3;
  ctx.fillStyle = ctx.createLinearGradient(0, 0, 0, h);
  ctx.fillStyle.addColorStop(0, 'rgba(0,0,0,1)');
  ctx.fillStyle.addColorStop(1.0, 'rgba(225,225,225,0)');
  ctx.globalCompositeOperation = 'destination-out';
  img.rect(0,0, width, h);
  img.pop();

  return img;
}


const drawLamp = (x, y, w) => {
  const W = 100;
  const rate = w / W;

  push();
  translate(x, y);
  scale(rate, rate);

  // Cable
  push();
  noStroke();
  fill(0);
  drawCable(y/rate);
  pop();

  // Socket
  push();
  fill(0);
  drawSocket();
  pop();
	
  // Bulb
  push();
  fill(colBulb);
  drawingContext.shadowColor = colLight;
  drawingContext.shadowBlur = 500;
  drawBulb();
  drawingContext.shadowBlur = 100;
  drawBulb();
  drawingContext.shadowBlur = 50;
  drawBulb();
  pop();

  pop();
}

const drawCable = (cableH) => {
  const cableW = 15;

  push();
  translate(-cableW/2, 0);
  scale(1, -1);
  rect(0,0,cableW, cableH);
  pop();
}

const drawSocket = () => {
  const ctx = drawingContext;
  push();
	ctx.beginPath();
	ctx.moveTo(21.870834, 73.432280);
	ctx.bezierCurveTo(24.115024, 72.064122, 25.683604, 70.425730, 25.647194, 68.145362);
	ctx.lineTo(26.264994, 2.058915);
	ctx.bezierCurveTo(26.151594, -6.844179, 14.746614, -12.291275, 0.000005, -12.291275);
	ctx.bezierCurveTo(-14.746626, -12.291275, -26.151605, -6.844179, -26.264995, 2.058915);
	ctx.lineTo(-25.647195, 68.145362);
	ctx.bezierCurveTo(-25.683195, 70.425730, -24.115025, 72.064122, -21.870825, 73.432280);
	ctx.closePath();
	ctx.fill();
  pop();
}

const drawBulb = () => {
  const ctx = drawingContext;
  push();
	ctx.beginPath();
	ctx.moveTo(41.130334, 185.590400);
	ctx.bezierCurveTo(52.543224, 169.128370, 51.996854, 147.279170, 42.263224, 126.679080);
	ctx.bezierCurveTo(31.735534, 105.387100, 26.896324, 98.763527, 26.024834, 78.719196);
	ctx.bezierCurveTo(26.268834, 75.002496, 24.094814, 73.432280, 21.870834, 73.432280);
	ctx.lineTo(-21.870885, 73.432280);
	ctx.bezierCurveTo(-24.094865, 73.432280, -26.268865, 75.002496, -26.024895, 78.719196);
	ctx.bezierCurveTo(-26.638195, 101.569280, -31.735586, 105.387100, -42.263276, 126.679080);
	ctx.bezierCurveTo(-51.996896, 147.279170, -52.543246, 169.128370, -41.130366, 185.590400);
	ctx.bezierCurveTo(-29.717485, 202.052420, -15.834596, 208.172790, -0.000015, 208.043620);
	ctx.bezierCurveTo(15.834534, 208.172820, 29.717444, 202.052420, 41.130334, 185.590400);
	ctx.closePath();
	ctx.fill();
  pop();
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
