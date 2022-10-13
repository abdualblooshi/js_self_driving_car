/*
  Author : @gitanimous
  Main script file
  - contains the simulation loop and render functions
*/

const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update(road.borders);
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height / 1.5);
  road.draw(ctx);
  car.draw(ctx);
  if (car.damaged) {
    setTimeout(function () {
      car.x = road.getLaneCenter(1);
      car.speed = 5;
      car.angle = 0;
      car.damaged = false;
      let message = document.getElementById("message");
      message.style.display = "none";
    }, 1000);
  }
  ctx.restore();
  requestAnimationFrame(animate);
}
