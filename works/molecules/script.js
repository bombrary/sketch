function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  const palette = ['#14471E', '#68904D', '#C8D2D1', '#EE9B01', '#DA6A00'];

  const N = 10;
  const M = 10;

  const W = max(width / N, height / M);

  // L = 1.5*R
  // W = 6*R + 2*L = 9*R -> R = W/9
  const R = W/9;
  const L = 1.5*R

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const x = W * j;
      const y = W * i;
      push();
      translate(W/2, W/2);
      translate(x, y);
      const p = shuffle(palette);
      rotate(map(noise(i * 0.1, j * 0.1), 0, 1, -PI, PI));
      drawMolecule(R, L, p);
      pop();
    }
  }

  noLoop();
}

const drawMolecule = (R, L, palette) => {

  noStroke();

  fill(palette[0]);
  ellipse(0, 0, 2*R);

  fill(palette[1]);
  ellipse(0, -L - 2*R, 2*R);

  fill(palette[2]);
  ellipse(0, L + 2*R, 2*R);

  fill(palette[3]);
  ellipse(L + 2*R, 0, 2*R);

  fill(palette[4]);
  ellipse(-L - 2*R, 0, 2*R);

  stroke(0);
  line(0, -R, 0, -L - R);
  line(R, 0, L + R, 0);
  line(0, R, 0, L + R);
  line(-R, 0, -L - R, 0);
};
