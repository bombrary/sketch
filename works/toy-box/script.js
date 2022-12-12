let palette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  palette = ['#FF9E9E', '#F8F988', '#C0EEE4'];
  background('#F9F9F9');
  rec(0, 0, width, height, 0)
}

const rec = (x, y, w, h, depth) => {
  if (w < width/10 || h < height/10) {
    noStroke();
    fill(random(palette));
    push();
    translate(x, y);
    translate(-w/2, -h/2);
    rotate(random(-PI/90, PI/90));
    translate(w/2, h/2);
    rect(0, 0, w, h);
    pop();
  } else {
    const t = random();
    if (random() < 0.5) {
      [newW, newH] = [t*w, h]
      rec(x + t*w, y, (1-t)*w, h, depth + 1);
      rec(x      , y,     t*w, h, depth + 1);
    } else {
      [newW, newH] = [w, t*h]
      rec(x, y + t*h, w, (1-t)*h, depth + 1);
      rec(x, y      , w,     t*h, depth + 1);
    }
  }
}
