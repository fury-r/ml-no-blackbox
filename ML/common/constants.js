const constants = {};
constants.DATA_DIR = "../data";
constants.RAW_DIR = constants.DATA_DIR + "/raw";
constants.DATASET_DIR = constants.DATA_DIR + "/datasets";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMAGE_DIR = constants.DATASET_DIR + "/images";
constants.SAMPLES = constants.DATASET_DIR + "/samples.json";
constants.JS_OBJECT = "../common/js-object";
constants.SAMPLES_JS = constants.JS_OBJECT + "/samples.js";
constants.FEATURES = constants.DATASET_DIR + "/features.json";
constants.TRAINING = constants.DATASET_DIR + "/training.json";
constants.TESTING = constants.DATASET_DIR + "/testing.json";
constants.TESTING_CSV = constants.DATASET_DIR + "/testing.csv";
constants.TRAINING_CSV = constants.DATASET_DIR + "/training.csv";

constants.FEATURES_JS = constants.JS_OBJECT + "/features.js";
constants.TRAINING_JS = constants.JS_OBJECT + "/training.js";
constants.TESTING_JS = constants.JS_OBJECT + "/testing.js";
constants.EVALUATE_MODEL_FOR_K = constants.JS_OBJECT + "/evaluate.js";
constants.MIN_MAX_JS = constants.JS_OBJECT + "/minMax.js";
constants.DECISION_BOUNDARY = constants.DATASET_DIR + "/decision_boundary.png";
if (typeof module !== "undefined") {
  module.exports = constants;
}
