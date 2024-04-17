const draw = require("../common/draw");
const { createCanvas } = require("canvas");
const constants = require("../common/constants");
const utils = require("../common/utils");

const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

const fs = require("fs");

const fileNames = fs.readdirSync(constants.RAW_DIR);

const samples = [];
let id = 1;

fileNames.forEach((file) => {
  const content = fs.readFileSync(constants.RAW_DIR + "/" + file);

  const { session, drawings, student } = JSON.parse(content);

  Object.entries(drawings).forEach(([label, path]) => {
    samples.push({
      id: id,
      label,
      name: student,
      user_id: session,
    });
    utils.printProgress(id, fileNames.length * 100);
    generateImageFile(`${constants.IMAGE_DIR}/${id}.png`, path);
    fs.writeFileSync(`${constants.JSON_DIR}/${id}.json`, JSON.stringify(path));
    id++;
  });
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));
fs.writeFileSync(
  constants.SAMPLES_JS,
  `const samples=${JSON.stringify(samples)};`
);

function generateImageFile(location, path) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  draw.paths(ctx, path);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(location, buffer);
}
