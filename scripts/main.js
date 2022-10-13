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
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "AI", 2)];
animate();

function animate() {
  traffic.forEach((car) => {
    car.update(road.borders);
  });
  car.update(road.borders);

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height / 1.5);

  road.draw(ctx);
  traffic.forEach((trafficCar) => {
    trafficCar.draw(ctx);
  });
  if (car.damaged) {
    setTimeout(function () {
      let message = document.getElementById("message");
      message.style.display = "none";
      reloadOnce();
    }, 2000);
  }
  car.draw(ctx);
  ctx.restore();
  requestAnimationFrame(animate);
}

let reloaded = false;

function reloadGame() {
  if (!reloaded) {
    reloaded = true;
    window.location.reload();
  }
}

function reloadOnce() {
  if (!reloaded) reloadGame();
}
