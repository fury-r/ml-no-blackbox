class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.laneCount = laneCount;
    this.left = x - width / 2;
    this.right = x + width / 2;
    this.width = width;
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }
  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    for (let i = 1; i <= this.laneCount - 1; i++) {
      //linear interpolation
      const x = lerp(this.left, this.right, i / this.laneCount);
      ctx.setLineDash([20, 20]); // size,gap

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }

  getLaneCenter(index) {
    const laneWidth = this.width / this.laneCount;
    //(move to middle of first lane) (get offset for n lane)
    return (
      this.left +
      laneWidth / 2 +
      Math.min(index, this.laneCount - 1) * laneWidth
    );
  }
}
