function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(15);

  const walkers = [];
  const num = 1000;

  for (let i = 0; i < num; i++) {
    walkers.push({
      x: random(width),
      y: random(height),
    });
  }

  stroke(255, 180);
  strokeWeight(1);

  for (let s = 0; s < 600; s++) {
    for (const w of walkers) {
      point(w.x, w.y);

      const n = noise(w.x * 0.003, w.y * 0.003);
      const angle = n * TAU * 2; // 有機的な流れ
      w.x += cos(angle);
      w.y += sin(angle);
    }
  }
  noLoop();
}
