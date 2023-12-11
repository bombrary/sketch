const points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  fill(255)
  noStroke();

  drawRain(100);

  let prevW = 0;
  for (let x = 0; x <= width; x += prevW / 2) {
    const w = random(width/32, width / 4);
    const h = random(height/128, height / 4);

    fill(random(64, 128));
    push();
    translate(x, height - h);
    rect(0, 0, w, h);
    pop();

    prevW = w;
  }

  drawRain(100);
  noLoop();
}

const drawRain = (N) => {
  fill('#192655');
  for (let i = 0; i < N; i++) {
    const p = createVector(random(0, width), random(0, height))
    let r = random(0, 10);
    while (r >= 1e-5) {
      ellipse(p.x, p.y, r);
      p.add(createVector(0, -1));
      r -= 0.1;
    }
  }
};
