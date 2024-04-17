const featureOperation = {};

featureOperation.getPathCount = (paths) => paths.length;

featureOperation.getPointCount = (paths) => paths.flat().length;
featureOperation.getDrawingWidth = (paths) => {
  const points = paths.flat();

  const x = points.map((p) => p[0]);
  return Math.max(...x) - Math.min(...x);
};

featureOperation.getDrawingHeight = (paths) => {
  const points = paths.flat();

  const y = points.map((p) => p[1]);
  return Math.max(...y) - Math.min(...y);
};

featureOperation.inUse = [
  {
    label: "width",
    fn: featureOperation.getDrawingWidth,
  },
  {
    label: "height",
    fn: featureOperation.getDrawingHeight,
  },
  // {
  //   label: "Path Count",
  //   fn: featureOperation.getPathCount,
  // },
  // {
  //   label: "Point Count",
  //   fn: featureOperation.getPointCount,
  // },
];
if (typeof module !== "undefined") {
  module.exports = featureOperation;
}
