let tree, palette;
const depthMax = 5;
const flowerRadius = 7.5;
const nodeMass = 1;
const coefRestore = 0.01;
const coefAir = 0.01;
const windMax = 0.002;
const windPeriod = 1000;
const randomForceVar = 0.0005;
let branchLenMean, branchLenStd;
let branchAngleMean, branchAngleStd;

function setup() {
  createCanvas(windowWidth, windowHeight);

  palette = ['#F4EAD5', '#CCD6A6', '#FF9E9E'].map((c) => color(c));
  [branchAngleMean, branchAngleStd] = [PI/6, 0.01];
  [branchLenMean, branchLenStd] = [height / depthMax - (10 * depthMax), 20];
  iterMax = height;

  tree = new Tree(createVector(0, -1),
                  randomGaussian(branchLenMean, branchLenStd),
                  0,
                  depthMax);
}

function draw() {
  background(palette[0]);

  const t = deltaTime * frameCount;
  const windX = windMax*sin(t/windPeriod);
  tree.addCanvasForce(createVector(windX, 0)); // the wind using sin function
  tree.addRandomForce();
  tree.moveAngle();

  tree.draw(width / 2, height);
}


class Tree {
  constructor(direction, length, angle, depth) {
    this.length = length;
    this.angle = angle;
    this.angleCenter = angle;
    this.direction = direction.normalize();

    this.vecAngle = 0;
    this.forceAngle = 0;
    this.mass = nodeMass;

    this.children = [];
    this.extend(depth);
  }

  extend(depth) {
    if (depth > 0) {
      const v = p5.Vector.rotate(this.direction, this.angle);
      const angle = randomGaussian(branchAngleMean, branchAngleStd);
      const length = randomGaussian(branchLenMean, branchLenStd);
      this.children.push(
        new Tree(v, length, angle, depth - 1),
        new Tree(v, length, -angle, depth - 1));
    }
  }

  addCanvasForce(forceCanvas) {
    const normalVec = p5.Vector.rotate(this.direction, this.angle)
                         .rotate(HALF_PI);
    this.forceAngle = normalVec.dot(forceCanvas);
    this.children.forEach((c) => c.addCanvasForce(forceCanvas));
  }

  addRandomForce() {
    this.forceAngle += randomGaussian(0, randomForceVar);
    this.children.forEach((c) => c.addRandomForce());
  }

  moveAngle() {
    this.forceAngle += -coefRestore*(this.angle - this.angleCenter); // restoring force
    this.forceAngle += -coefAir*this.vecAngle; // air resistanse
    this.accAngle = this.forceAngle / this.mass; // equation of motion
    this.forceAngle = 0; // initialize force

    this.vecAngle += this.accAngle;
    this.angle += this.vecAngle;

    this.children.forEach((c) => c.moveAngle());
  }

  draw(x, y) {
    const v = p5.Vector.rotate(this.direction, this.angle)
                       .mult(this.length);

    stroke(palette[1]);
    strokeWeight(5);
    line(x, y, x + v.x, y + v.y);

    if (this.children.length > 0) {
      this.children.forEach((c) => c.draw(x + v.x, y + v.y));
    } else {
      noStroke();
      fill(palette[2]);
      circle(x + v.x, y + v.y, flowerRadius);
    }
  }
}
