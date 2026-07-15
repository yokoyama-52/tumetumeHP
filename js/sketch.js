let blobs = [];

const NUM = 28;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  
  for (let i = 0; i < NUM; i++) {
    blobs.push(new Blob());
  }

  noStroke();
}

function draw() {
  background(235, 248, 255);

  // 動かす
  for (let b of blobs) {
    b.update();
  }

  // 衝突判定
  for (let i = 0; i < blobs.length; i++) {
    for (let j = i + 1; j < blobs.length; j++) {
      blobs[i].collide(blobs[j]);
    }
  }

  // 描画
  for (let b of blobs) {
    b.display();
  }
}

class Blob {
  constructor() {
    this.x = random(width);
    this.y = random(height);

    this.r = random(40, 80);

    this.vx = random(-0.4, 0.4);
    this.vy = random(-0.4, 0.4);

    this.seed = random(1000);

    const colors = [
        color("#BDEBFF"),
        color("#C8F7F4"),
        color("#D7F8D2"),
        color("#FFF8B5"),
        color("#E7D8FF"),
        color("#FFD9E8"),
        color("#FFE5C4")
    ];

    this.c = random(colors);
  }
  
  collide(other) {

    let dx = other.x - this.x;
    let dy = other.y - this.y;

    let overlapX = (this.r + other.r) - abs(dx);
    let overlapY = (this.r + other.r) - abs(dy);

    if (overlapX > 0 && overlapY > 0) {

        // めり込みが少ない方向へ押し出す
        if (overlapX < overlapY) {

            let push = overlapX / 2;

            if (dx > 0) {
                this.x -= push;
                other.x += push;
            } else {
                this.x += push;
                other.x -= push;
            }

            // X方向だけ少し弾ませる
            let temp = this.vx;
            this.vx = other.vx * 0.7;
            other.vx = temp * 0.7;

        } else {

            let push = overlapY / 2;

            if (dy > 0) {
                this.y -= push;
                other.y += push;
            } else {
                this.y += push;
                other.y -= push;
            }

            // Y方向だけ少し弾ませる
            let temp = this.vy;
            this.vy = other.vy * 0.7;
            other.vy = temp * 0.7;
        }
    }
 }

  update() {

    // ゆらゆら漂う
    this.vx += map(noise(this.seed, frameCount * 0.003),0,1,-0.02,0.02);
    this.vy += map(noise(this.seed+200, frameCount * 0.003),0,1,-0.02,0.02);

    this.vx *= 0.98;
    this.vy *= 0.98;

    // マウスで押す
    let d = dist(mouseX, mouseY, this.x, this.y);

    if (d < 140) {

      let angle = atan2(this.y - mouseY, this.x - mouseX);

      let force = map(d,0,140,1.8,0);

      this.vx += cos(angle) * force * 0.12;
      this.vy += sin(angle) * force * 0.12;
    }

    this.x += this.vx;
    this.y += this.vy;

    // 壁
    if (this.x < this.r) {
      this.x = this.r;
      this.vx *= -0.8;
    }

    if (this.x > width - this.r) {
      this.x = width - this.r;
      this.vx *= -0.8;
    }

    if (this.y < this.r) {
      this.y = this.r;
      this.vy *= -0.8;
    }

    if (this.y > height - this.r) {
      this.y = height - this.r;
      this.vy *= -0.8;
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    fill(
        red(this.c),
        green(this.c),
        blue(this.c),
        120
    );

    beginShape();

    let radius = this.r;

    for (let a = 0; a < TWO_PI; a += 0.15) {

        // 角丸四角形
        let x = cos(a);
        let y = sin(a);

        let k = 0.82; // 小さいほど四角い
        let xx = radius * x / max(abs(x), k);
        let yy = radius * y / max(abs(y), k);

        // 表面だけぷにぷに
        let wobble =
        sin(frameCount * 0.04 + this.seed + a * 4) * 2;

        vertex(
        xx + cos(a) * wobble,
        yy + sin(a) * wobble
        );
    }

    endShape(CLOSE);

    // ハイライト
    fill(255, 255, 255, 60);
    ellipse(-radius * 0.25, -radius * 0.25, radius * 0.5, radius * 0.3);

    pop();
    }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}