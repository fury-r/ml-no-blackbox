const draw = {};

draw.path = (ctx, path, color = "black") => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(...path[0]);
  path.slice(0, 1);
  path.map((value) => {
    try {
      ctx.lineTo(...value);
    } catch (err) {
      console.log(err);
    }
  });
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
};

draw.paths = (ctx, paths, color = "black") => {
  paths.map((path) => draw.path(ctx, path, color));
};

if (typeof module !== "undefined") {
  module.exports = draw;
}
