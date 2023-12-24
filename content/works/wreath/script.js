const palette = ['#DC3535', '#FFE15D', '#82CD47', '#fff'];
const wreathColor = '#82CD47';

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  const R = width / 4;
  const r = R / 2;

  drawDonut(R, r)

  const N = 1000;
  push();
  translate(width/2, height/2);
  for (let i = 0; i < N; i++) {
    noStroke();
    fill(random(palette));

    const rpos = random(r, R);
    const th = random(-PI, PI);
    const x = rpos * cos(th);
    const y = rpos * sin(th);

    const rMax = min(R - rpos, rpos - r);
    ellipse(x, y, random(0, rMax));
  }
  pop();

  push();
  translate(width/2, height/2);
  for (let i = 0; i < N; i++) {
    noStroke();
    fill(random(palette));

    const rpos = random(r/2, R*2);
    const th = random(-PI, PI);
    const x = rpos * cos(th);
    const y = rpos * sin(th);

    const rMax = min(R - rpos, rpos - r);
    ellipse(x, y, random(0, rMax));
  }
  pop();

  push();
  {
    const img = createGraphics(width, height);
    img.background(255, 255, 128, 64);
    img.erase();
    img.noStroke();
    img.fill(0);
    img.translate(width/2, height/2)
    img.ellipse(0, 0, width);
    img.filter(BLUR, 10);
    image(img, 0, 0);
  }
  pop();

  noLoop();
}

const drawDonut = (R, r) => {
  const img = createGraphics(width, height);

  img.translate(width/2, height/2);
  img.fill(wreathColor);
  img.noStroke();
  img.ellipse(0, 0, R*2)
  img.erase();
  img.ellipse(0, 0, r*2);
  img.noErase();

  image(img, 0, 0);
};
