const constants = require("../common/constants");
const utils = require("../common/utils");

const { KNN } = require("../common/classifiers/KNN");
const fs = require("fs");

console.log("Running classifications..");

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);
const n = 100;
const evaluate = [];
const knn = new KNN(trainingSamples);

new Array(n).fill(0).forEach((_, index) => {
  const { samples: testingSamples } = JSON.parse(
    fs.readFileSync(constants.TESTING)
  );

  let correct = 0;
  const k = index + 1;
  testingSamples.forEach((sample) => {
    const { label } = knn.predict(sample.point, k);
    if (label) {
      if (sample.label === label) {
        correct++;
      }
    }
  });

  evaluate.push({
    correct,
    k: index + 1,
    accuracy: utils.formatPercent(correct / testingSamples.length),
  });
  console.log(
    `Accuracy:${correct}/${testingSamples.length}(${utils.formatPercent(
      correct / testingSamples.length
    )}) for k= ${index + 1}`
  );
});
const maxK = evaluate.sort((a, b) => a.correct - b.correct).reverse()[0].k;

fs.writeFileSync(
  constants.EVALUATE_MODEL_FOR_K,
  `const evaluate=${JSON.stringify({
    data: evaluate
      .map((value) => ({
        correct: value.correct,
        k: value.k,
        accuracy: value.accuracy,
      }))
      .sort((a, b) => a.k - b.k),
    accuracteK: maxK,
  })};`
);
const { createCanvas } = require("canvas");
const canvas = createCanvas(100, 100);
const ctx = canvas.getContext("2d");
console.log("HIGHEST_ACCURACY", maxK);
for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    // 1-y is been done so that points start from bottom up on the y axis and top bottom
    const point = [x / canvas.width, 1 - y / canvas.height];

    const { label } = knn.predict(point, maxK);

    const color = utils.styles[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}

const bufferImage = canvas.toBuffer("image/png");

fs.writeFileSync(constants.DECISION_BOUNDARY, bufferImage);

console.log("Finished!");
