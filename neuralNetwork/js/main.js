const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");

// Car(x,y,w,h)
const car = new Car(100, 100, 30, 50);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  car.draw(ctx);

  //keeps calling function in a loop
  requestAnimationFrame(animate);
}
