const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");

// Car(x,y,w,h)
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(3), 100, 30, 50);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  ctx.save();
  //car placement
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();
  //keeps calling function in a loop
  requestAnimationFrame(animate);
}
