const walkers = [];
const num = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < num; i++) {
    walkers.push({
      x: random(width),
      y: random(height),
      life: random(100, 1000),
    });
  }

}

function draw() {
  background(15, 15, 15, 20);

  stroke(255, 180);
  strokeWeight(1);

  for (const w of walkers) {
    point(w.x, w.y);

    const n = noise(w.x * 0.003, w.y * 0.003);
    const angle = n * TAU * 2; // 有機的な流れ
    if (w.life <= 0) {
      w.x = random(width)
      w.y = random(height)
      w.life = random(100, 1000)
    } else {
      w.x += cos(angle);
      w.y += sin(angle);
      w.life -= 1;
    }
  }
}
