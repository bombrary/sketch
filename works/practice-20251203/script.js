const walkers = [];
const num = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < num; i++) {
    walkers.push({
      vx: random(0, 1),
      vy: random(0, 1),
      x: random(width),
      y: random(height),
      life: random(100, 1000),
    });
  }

  background(0)
}

function draw() {
  background(0, 0, 0, 3);

  stroke(255, 180);
  strokeWeight(1);

  for (const w of walkers) {
    point(w.x, w.y);

    const n = noise(w.x * 0.003, w.y * 0.003);
    const angle = n * TAU * 2; // 有機的な流れ
    if (w.life <= 0) {
      w.vx = random(0, 1)
      w.vy = random(0, 1)
      w.x = random(width)
      w.y = random(height)
      w.life = random(100, 1000)
    } else {
      w.vx += 0.05 * cos(angle);
      w.vy += 0.05 * sin(angle);
      w.x += w.vx;
      w.y += w.vy;
      w.life -= 1;
    }
  }
}
