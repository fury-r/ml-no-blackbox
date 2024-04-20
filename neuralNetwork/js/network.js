class NeuralNetwork {
  // number of neurons per layer
  constructor(neuronCounts) {
    this.neuronCounts = neuronCounts;
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, networks) {
    let outputs = Level.feedForward(givenInputs, networks.levels[0]);
    for (let i = 1; i < networks.levels.length; i++) {
      //use outputs for previous as input to new layer
      outputs = Level.feedForward(outputs, networks.levels[i]);
    }
    return outputs;
  }
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      level.biases = level.biases.map((bias) =>
        lerp(bias, Math.random() * 2 - 1, amount)
      );

      level.weights = level.weights.map((weight) =>
        weight.map((w) => lerp(w, Math.random() * 2 - 1, amount))
      );
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);
    this.weights = new Array(inputCount)
      .fill(0)
      .map(() => new Array(outputCount));
    Level.#randomize(this);
  }
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.outputs.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
  static feedForward(givenInputs, level) {
    level.inputs = givenInputs;

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        //dot product between inputs and weight
        sum += level.inputs[j] * level.weights[j][i];
      }
      //activation
      //ws+b=0, weights,sum,bias
      //   level.outputs[i] = sum+level.biases[i] > 0? 1 : 0;

      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }
    return level.outputs;
  }
}
