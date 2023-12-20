const palette = ['#FED9ED', '#E7BCDE', '#BB9CC0']
const baseCol = '#67729D'

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(baseCol);
}

function draw() {

  noStroke();
  const N = 20;
  const M = 20;
  const D = dist(0, 0, width/2, height/2);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const y = i / N * height;
      const x = j / M * width;
      const v = createVector(x - width/2, y - height/2);
      v.setMag(map(v.mag(), 0, D, 100, 0));

      push();
      translate(x, y);
      translate(v.x, v.y);
      fill(random(palette));
      randomVertex(10, width/M, height/N);
      pop();
    }
  }

  noLoop();
}

const randomVertex = (N, W, H) => {
  beginShape();
  for (let i = 0; i < N; i++) {
    const x = random(0, W);
    const y = random(0, H);
    vertex(x, y);
  }
  endShape(CLOSE);
};
