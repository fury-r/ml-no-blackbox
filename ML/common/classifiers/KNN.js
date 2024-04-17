if (typeof utils !== "undefined") {
  utils = require("../utils");
}

class KNN {
  constructor(trainingSamples) {
    this.trainingSamples = trainingSamples;
  }

  predict(point, k) {
    const indices = this.getKNearestNeigbhbor(point, this.trainingSamples, k);
    const kNearestsamples = indices.map((value) => this.trainingSamples[value]);
    const kLabels = kNearestsamples.map((k) => k.label);

    const counts = {};

    kLabels.forEach((label) => {
      if (!Object.keys(counts).includes(label)) {
        counts[label] = 0;
      }
      counts[label] += 1;
    });

    const maxCount = Math.max(...Object.values(counts));
    const label = kLabels.find((label) => counts[label] == maxCount);

    return {
      label,
      accuracy: utils.formatPercent(maxCount / kLabels.length),
      kNearestsamples,
    };
  }

  getKNearestNeigbhbor = (loc, paths, k = 1) => {
    const obj = paths.map(({ point }, index) => ({ index, point }));

    //sort so that the nearest ones are closer
    const sorted = obj.sort(
      (a, b) =>
        utils.getDistance(loc, a.point) - utils.getDistance(loc, b.point)
    );
    return sorted.map((value) => value.index).slice(0, k);
  };
}

if (typeof module !== "undefined") {
  module.exports = { KNN };
}
