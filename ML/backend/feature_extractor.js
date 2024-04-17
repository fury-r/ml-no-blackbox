const constants = require("../common/constants");
const featureOperation = require("../common/featureOperation");
const utils = require("../common/utils");

const fs = require("fs");
console.log("Extracting features...");

const writeToJSONandJSFile = (path, values) => {
  [constants[path], constants[`${path}_JS`]].map((value, index) => {
    fs.writeFileSync(value, values[index]);
  });
};

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

samples.forEach((sample) => {
  const paths = JSON.parse(
    fs.readFileSync(`${constants.JSON_DIR}/${sample.id}.json`)
  );
  // sample.point = [features.getPathCount(paths), features.getPointCount(paths)];
  sample.point = featureOperation.inUse.map((value) => value.fn(paths));
});

//normalizations training data to get the min(x,y), max(x,y) and get inverseLerp(Determines where values lies between point a  and b)

// const minMax = utils.normalizePoints(samples.map((s) => s.point));

// const featureNames = ["Path Count", "Point Count"];
const featureNames = featureOperation.inUse.map((value) => value.label);
const obj = JSON.stringify({ featureNames, samples });

console.log("Split data");

const trainingAmount = samples.length * 0.5;

const trainingData = samples.slice(0, trainingAmount);
//normalization using standard deviations ,get mean and std.Get zscore for each point[i][j], where i is row and j is column position
const minMax = utils.normalizePoints(trainingData.map((s) => s.point));
const training = JSON.stringify({
  featureNames,
  samples: trainingData,
});

const testingData = samples.slice(trainingAmount, samples.length);
//normalize testing data using  by getting zscore of point[i][j] using  standard deviations and mean from training data
utils.normalizePoints(
  testingData.map((s) => s.point),
  minMax
);

const testing = JSON.stringify({
  featureNames,
  samples: testingData,
});

fs.writeFileSync(
  constants.TRAINING_CSV,
  utils.toCSV(
    [...featureNames, "Label"],
    trainingData.map((a) => [...a.point, a.label])
  )
);
fs.writeFileSync(
  constants.TESTING_CSV,
  utils.toCSV(
    [...featureNames, "Label"],
    testingData.map((a) => [...a.point, a.label])
  )
);
writeToJSONandJSFile("FEATURES", [obj, `const features=${obj};`]);
writeToJSONandJSFile("TRAINING", [training, `const training=${training};`]);
writeToJSONandJSFile("TESTING", [testing, `const testing=${testing};`]);

fs.writeFileSync(
  constants.MIN_MAX_JS,
  `const minMax=${JSON.stringify(minMax)};`
);

console.log("Extracting features");
