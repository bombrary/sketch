const points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  const spacing = 10;
  const N = min(Math.floor(width / spacing), 100);
  const M = min(Math.floor(height / spacing), 100);

  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= M; j++) {
      const y = height / N * i;
      const x = width / M * j;
      points.push(createVector(x, y));
    }
  }

  fill('#ECE3CE');
  background('#005B41');
  noStroke();
}

function draw() {
  const mult = 0.01;

  for (const p of points) {
    const ang = map(noise(p.x * mult, p.y * mult), 0, 1, -PI, PI);
    p.add(createVector(cos(ang), sin(ang)));
    ellipse(p.x, p.y, 2);
  }
}
