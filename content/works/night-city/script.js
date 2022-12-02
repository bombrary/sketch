const cols = ['#001F3F', '#083358', '#0D63A5', '#FFD717'];
const colsRedundant = [...new Array(8).fill(cols[0]),
                       ...new Array(4).fill(cols[1]),
                       ...new Array(2).fill(cols[2]),
                       ...new Array(1).fill(cols[3])];
const dt = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(cols[0]);

  noStroke();

  for (let i = 0; i < 1000; i++) {
    const p1 = createVector(random(0, width), random(0, height));
    const p2 = createVector(width / 2, height / 2);
    const vec = p5.Vector.sub(p2, p1).mult(random(0, 0.5));

    band(p1, vec, abs(randomGaussian(0, 10)));
  }

}

const band = (pos, vec, w) => {
  const norm = p5.Vector.rotate(vec, HALF_PI).normalize();
  const c1 = pickUpColor();
  const c2 = pickUpColor();
  
  const N = Math.floor(w / dt);
  for (let i = 0; i < N; i++) {
    const v = p5.Vector.mult(norm, i);
    const p = p5.Vector.add(v, pos);
    stroke(gradientNoisy(c1, c2, i / N));
    strokeWeight(2);
    line(p.x, p.y, p.x + vec.x, p.y + vec.y);
  }
}

const gradientNoisy = (c1, c2, rate) => {
  if (random() < 0.5) {
    return lerpColor(c1, c2, random());
  } else {
    return lerpColor(c1, c2, rate);
  }
}

const pickUpColor = () => {
  const c1 = random(colsRedundant);
  const c2 = random(colsRedundant);
  return lerpColor(color(c1), color(c2), random());
};
