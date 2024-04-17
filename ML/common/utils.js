utils = {};
utils.flaggedUsers = [];
utils.formatPercent = (n) => {
  return (n * 100).toFixed(2) + "%";
};
utils.printProgress = (count, max) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  const percent = utils.formatPercent(count / max);

  process.stdout.write(`${count}/${max}  (${percent})`);
};

utils.groupBy = (arr, key) => {
  const groups = {};

  arr.forEach((element) => {
    const objKey = element[key];
    if (groups[objKey] == null) {
      groups[objKey] = [];
    }
    groups[objKey].push(element);
  });
  return groups;
};

utils.styles = {
  car: { color: "red", text: "🚗" },
  fish: { color: "blue", text: "🐠" },
  house: { color: "orange", text: "🏠" },
  tree: { color: "green", text: "🌳" },
  bicycle: { color: "cyan", text: "🚲" },
  guitar: { color: "yellow", text: "🎸" },
  pencil: { color: "magenta", text: "✏️" },
  clock: { color: "lightgray", text: "🕒" },
};
utils.styles["?"] = { color: "red", text: "❓" };

utils.getDistance = (i, j) => {
  return Math.sqrt((i[0] - j[0]) ** 2 + (i[1] - j[1]) ** 2);
};
utils.getNearestNeighbour = (loc, paths) => {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest = 0;
  paths.forEach(({ point }, i) => {
    const dist = utils.getDistance(loc, point);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  });
  return {
    distance: minDist,
    nearest: nearest < samples.length ? samples[nearest] : null,
  };
};

utils.getKNearestNeigbhbor = (loc, paths, k = 1) => {
  const obj = paths.map(({ point }, index) => ({ index, point }));

  //sort so that the nearest ones are closer
  const sorted = obj.sort(
    (a, b) => utils.getDistance(loc, a.point) - utils.getDistance(loc, b.point)
  );
  return sorted.map((value) => value.index).slice(0, k);
};

utils.inverLerp = (a, b, v) => {
  return (v - a) / (b - a);
};
utils.normalizePoints = (points, minMax) => {
  const dimensions = points[0].length;
  let min, max;
  if (minMax) {
    min = minMax.min;
    max = minMax.max;
  } else {
    min = [...points[0]];
    max = [...points[0]];

    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < dimensions; j++) {
        min[j] = Math.min(min[j], points[i][j]);
        max[j] = Math.max(max[j], points[i][j]);
      }
    }
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      points[i][j] = utils.inverLerp(min[j], max[j], points[i][j]);
    }
  }
  return {
    min,
    max,
  };
};

//caculate mean sum of all elements and divide total elements in the flattend array
utils.mean = (points) => points.reduce((x, y) => y + x) / points.length;

utils.getVariance = (points, mean) =>
  points.reduce((sum, value) => sum + Math.pow(value - mean, 2));

utils.std = (points, mean = null) => {
  return Math.sqrt(mean ? utils.getVariance(points, mean) : points);
};

utils.zscore = (value, mean, std) => (value - mean) / std;
utils.standardizations = (points, zscoreValues) => {
  let mean, std;
  const dimensions = points[0].length;

  if (zscoreValues) {
    mean = zscoreValues.mean;
    std = zscoreValues.std;
  } else {
    const flattenPoints = points.flat();
    mean = utils.mean(flattenPoints);
    std = utils.std(flattenPoints, mean);
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      points[i][j] = utils.zscore(points[i][j], mean, std);
    }
  }
  return { mean, std };
};

utils.toCSV = (headers, samples) => {
  return [headers.join(","), ...samples.map((value) => value.join(","))].join(
    "\n"
  );
};
if (typeof module !== "undefined") {
  module.exports = utils;
}
