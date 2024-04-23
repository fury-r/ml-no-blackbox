const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");

// Car(x,y,w,h)
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const trafficCars = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];
// const car = new Car(road.getLaneCenter(2), 100, 30, 50, "AI");
const cars = generateCars(1);

function generateCars(n) {
  return new Array(n)
    .fill(0)
    .map(() => new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
}
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  console.log("FROM SAVE");
  const brain = localStorage.getItem("bestBrain");
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(brain);
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
  console.log(bestCar);
}
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
  localStorage.removeItem("bestBrain");
}
animate();

function animate(time) {
  trafficCars.forEach((c) => c.update(road.borders, []));
  // car.update(road.borders, trafficCars);
  cars.map((car) => car.update(road.borders, trafficCars));
  //fitness function
  bestCar = cars.find((car) => car.y === Math.min(...cars.map((v) => v.y)));
  networkCanvas.height = window.innerHeight;
  carCanvas.height = window.innerHeight;

  carCtx.save();
  //car placement
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  trafficCars.forEach((c) => c.draw(carCtx, "red"));
  // car.draw(carCtx, "blue");
  carCtx.globalAlpha = 0.2;
  cars.map((car) => car.draw(carCtx, "blue"));
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  //keeps calling function in a loop
  requestAnimationFrame(animate);
}
