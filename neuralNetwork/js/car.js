class Car {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.controls = new Controls();
    this.acceleration = 0.2;
    this.speed = 0;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
  }
  update() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    //forward capping limit
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    //revetse capping limit
    if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed / 2;
    }
    //forward friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    //reverse friction
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      //to flip the controls of moving left and right while reversing without this car turns right when you press left(reverse mode)
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // move the car on turn using unit circle
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    //align in middle

    ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.fill();

    ctx.restore();
  }
}
