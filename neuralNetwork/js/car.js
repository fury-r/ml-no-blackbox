class Car {
  constructor(x, y, w, h, type, maxSpeed = 3, useBrain = false) {
    if (type !== "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.useBrain = type === "AI";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.controls = new Controls(type);
    this.acceleration = 0.2;
    this.speed = 0;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;
  }
  update(roadBorders, trafficCars) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, trafficCars);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, trafficCars);
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        [
          this.controls.forward,
          this.controls.left,
          this.controls.right,
          this.controls.reverse,
        ] = outputs;
      }
    }
  }
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.w, this.h) / 2;
    const alpha = Math.atan2(this.w, this.h);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }
  #move() {
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
    //reverse capping limit
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
      //to flip the controls of moving left and right while reversing without this car turns right when you press left( when reversing)
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
  draw(ctx, color, drawSensor = false) {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);
    // ctx.beginPath();
    // //align in middle

    // ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
    // ctx.fill();
    // ctx.style += "z-index:9;";

    // ctx.restore();
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    this.polygon.forEach((p, i) => {
      if (i > 0) ctx.lineTo(p.x, p.y);
    });
    ctx.fill();
    if (this.sensor && drawSensor) this.sensor.draw(ctx);
  }
}
