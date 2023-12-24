let red = '#DC3535';
let yellow = '#FFE15D';
let green = '#82CD47';
let black = '#000';
const palette = [red, green, yellow, '#fff'];
const wreathColor = '#82CD47';

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  red = color(red);
  green = color(green);
  yellow = color(yellow);
  black = color(black);

  const N = 10;
  background(255);
  noStroke();

  rotateX(-PI/64);
  translate(0, 0, 400);
  push();
  {
    // rotateY(-PI/16);
    translate(-N*100, 0, 0);
    for (let i = -N; i < N; i++) {
      translate(100, 0);
      drawBox();
    }
  }
  pop();

  push();
  stroke(lerpColor(green, black, 0.4));
  fill(green);
  translate(0, 150, 0);
  box(N*100, 200, 200);
  pop();

  noLoop();
}


const drawBox = () => {
  const isOpen = random([true, false]);
  const L = 50;

  stroke(lerpColor(red, black, 0.4));
  strokeWeight(1);
  push();
  {
    fill(red);
    rect(0, 0, L, L);

    push();
    {
      if (isOpen) {
        rotateX(-PI/10);
      } else {
        rotateX(-PI/2);
      }
      translate(0, -L, 0);
      rect(0, 0, L, L);
    }
    pop();

    push();
    {
      translate(0, 0, L);
      rect(0, 0, L, L);
    }
    pop();

    push();
    {
      translate(0, L, 0);
      rotateX(PI/2)
      rect(0, 0, L, L);
    }
    pop();

    push();
    {
      rotateY(-PI/2)
      rect(0, 0, L, L);
    }
    pop();

    push();
    {
      rotateY(-PI/2)
      translate(0, 0, -L);
      rect(0, 0, L, L);
    }
    pop();

    push();
    if (isOpen) {
      const N = 10;

      translate(25, 0, 25);
      for (let i = 0; i < N; i++) {
        push();
        {
          const y = random(-L, 0);
          const x = random(-L/2, L/2);
          const r = random(0, min(L/2-x, x + L/2));
          translate(x, y, 0);
          rotateZ(random(-PI, PI));
          stroke(lerpColor(yellow, black, 0.4));
          fill(yellow);
          star(r/2, r);
        }
        pop();
      }
    }
    pop();
  }
  pop();
};

const star = (r1, r2) => {
  const N = 5;
  beginShape();
  for (let i = 0; i < N; i++) {
    const ang = i / N * TWO_PI;
    const x = r2 * cos(ang);
    const y = r2 * sin(ang);
    vertex(x, y);

    const angmid = (i + 0.5) / N * TWO_PI;
    const xmid = r1*cos(angmid);
    const ymid = r1*sin(angmid);
    vertex(xmid, ymid);
    
  }
  endShape(CLOSE);
};
