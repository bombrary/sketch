let yellowPalette, bluePalette, bluePaletteRGB;
let grainImg;
let socket, light, code;
let sizeScale;

function setup() {
  createCanvas(windowWidth, windowHeight);
  yellowPalette = ['rgb(248,177,47)', 'rgb(250,230,144)', 'rgb(247,250,232)'].map((c) => color(c));
  bluePalette = ['rgb(33,26,58)', 'rgb(34,69,142)', 'rgb(99,190,237)'].map((c) => color(c));
  bluePaletteRGB = bluePalette.map((c) => [red(c), green(c), blue(c)]);
  grainImg = generateGrainImg();
  sizeScale = min(width, height)/150;
  socket = new Socket(sizeScale);
  light = new Light(sizeScale);
  code = new Code(5*sizeScale, 50*sizeScale, 5*sizeScale);
}

function draw() {
  background(bluePalette[0]);

  push();
    translate(width/2, 0);
    push();
      translate(0, code.h + socket.h - 0.15*sizeScale);
      light.draw();
    pop();

    push();
      translate(0, code.h);
      socket.draw();
    pop();

    push();
      translate(0, code.h/2);
      code.draw();
    pop();
  pop();

  image(grainImg, 0, 0);
}

const generateGrainImg = () => {
  const img = createGraphics(width, height);
  const d = img.pixelDensity();
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          const idx = 4 * ((y * d + j) * img.width * d + (x * d + i));
          [img.pixels[idx], img.pixels[idx + 1], img.pixels[idx + 2]] = random(bluePaletteRGB);
          img.pixels[idx + 3] = 64;
        }
      }
    }
  }
  img.updatePixels();
  return img;
};

class Light {
  constructor(size) {
    this.w = 35.454308;
    this.h = 47.990799;
    this.size = size
  }

  draw() {
    const t = sin(frameCount/50);
    push();
      scale(this.size * 0.9);
      noStroke();
      fill(yellowPalette[1]);
      drawingContext.shadowColor = bluePalette[2];
      drawingContext.shadowBlur = map(t, -1, 1, 0, 500);
      this.drawShape();
      drawingContext.shadowBlur = map(t, -1, 1, 0, 100);
      this.drawShape();
      drawingContext.shadowBlur = map(t, -1, 1, 0, 50);
      this.drawShape();
    pop();
    push();
      scale(this.size);
      noStroke();
      fill(map(t, -1, 1, 128, 255));
      light.drawShape();
    pop();
  }

  drawShape() {
    push();
    translate(-8.7090399,-41.749297);
    translate(-this.w/2, 0);
    beginShape();
    vertex(41.018672, 81.646468);
    bezierVertex(45.065034,75.809971,44.871322,68.063488,41.420332,60.759868);
    bezierVertex(37.687812,53.210947,35.972102,50.862607,35.663122,43.756027);
    bezierVertex(35.749622,42.438297,34.978848,41.881587,34.190352,41.881587);
    vertex(18.682027, 41.881587)
    bezierVertex(17.893530,41.881587,17.122754,42.438297,17.209254,43.756027);
    bezierVertex(16.991822,51.857364,15.184566,53.210947,11.452049,60.759868);
    bezierVertex(8.001060,68.063488,7.807357,75.809971,11.853714,81.646468);
    bezierVertex(15.900071,87.482965,20.822152,89.652898,26.436192,89.607098);
    bezierVertex(32.050222,89.652898,36.972310,87.482965,41.018672,81.646468);
    endShape(CLOSE);
    pop();
  }
}

class Socket {
  constructor(size) {
    this.w = 18.888741 * size;
    this.h = 30.657272 * size;
    this.size = size
  }

  draw() {
    push();
    noStroke();
    fill(0);
    translate(-this.w/2, 0);
    scale(this.size);
    this.drawShape();
    pop();
  }

  drawShape() {
    push();
    translate(-16.991822,-7.8480604)
    beginShape();
    vertex(34.190354, 38.373042);
    bezierVertex(34.986014,37.887972,35.542144,37.307092,35.529234,36.498602);
    vertex(35.748264,13.068112);
    bezierVertex(35.708064,9.911582,31.664504,7.980352,26.436194,7.980352);
    bezierVertex(21.207879,7.980352,17.164321,9.911582,17.124121,13.068112);
    vertex(17.343145,36.498602);
    bezierVertex(17.330235,37.307092,17.886364,37.887972,18.682029,38.373042);
    endShape(CLOSE);
    pop();
  }
}

class Code {
  constructor(w, h, pady) {
    this.w = w;
    this.h = h;
    this.pady = pady;
  }

  draw() {
    push();
    noStroke();
    fill(0);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h + this.pady);
    pop();
  }
}
