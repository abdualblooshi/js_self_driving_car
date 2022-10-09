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
car.draw(ctx);
animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update(road.borders);
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height / 1.5);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();
  requestAnimationFrame(animate);
}
