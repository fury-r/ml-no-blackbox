class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2; //45 degress
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, trafficCars) {
    this.#castRays();
    this.readings = [];

    this.rays.forEach((ray) => {
      this.readings.push(this.#getReadings(ray, roadBorders, trafficCars));
    });
  }

  #getReadings(ray, roadBorders, trafficCars) {
    let touches = [];

    roadBorders.forEach((border) => {
      // get touch using intersection
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) {
        touches.push(touch);
      }
    });
    trafficCars.forEach((car) => {
      for (let i = 1; i < roadBorders.length; i++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          roadBorders[i - 1],
          roadBorders[i]
        );
        if (touch) {
          touches.push(touch);
        }
      }
      car.polygon.forEach((_, j) => {
        const intersection = getIntersection(
          ray[0],
          ray[1],
          car.polygon[j],
          car.polygon[(j + 1) % car.polygon.length]
        );
        if (intersection) {
          touches.push(intersection);
        }
      });
    });
    if (touches.length === 0) {
      return null;
    }
    const minOffset = Math.min(...touches.map((e) => e.offset));
    return touches.find((value) => value.offset === minOffset);
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      //calculate ray angle using unit circle
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      //calculate ray end using unit circle
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }
  draw(ctx) {
    this.rays.forEach((ray, index) => {
      let end = ray[1];
      if (this.readings[index]) {
        end = this.readings[index];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }
}
