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
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 4);
const traffic = [new Car(road.getLaneCenter(2), -100, 30, 50, "AI", 2)];
let carLocation = car.y;
setTimeout(() => {
  setInterval(() => {
    generateTraffic(carLocation);
  }, 1000);
}, 100);
animate();

function animate() {
  traffic.forEach((car) => {
    car.update(road.borders, []);
  });
  car.update(road.borders, traffic);

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
  carLocation = car.y;
  console.log(carLocation);
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

function passedCar(carLocation) {
  if (Math.abs(carLocation) > 1000) {
    traffic.shift();
  }
}

function generateRandomLocation(carLocation) {
  let randomLocation = randomIntFromInterval(
    carLocation - 1000,
    carLocation + 1000
  );
  if (randomLocation === carLocation) {
    randomLocation += 300;
  }

  return randomLocation;
}

function generateTraffic(carLocation) {
  let random = Math.random();
  if (random < 0.1) {
    let randomLocation = generateRandomLocation(carLocation);
    let randomLane = Math.floor(Math.random() * 3);
    let randomCar = new Car(
      road.getLaneCenter(randomLane),
      randomLocation,
      30,
      50,
      "AI",
      2
    );
    traffic.push(randomCar);
    console.log(
      `Front: Car generated at: ${randomLane} lane at: x=${randomLocation}`
    );
    let backRandomLocation = generateRandomLocation(carLocation);
    let backRandomLane = Math.floor(Math.random() * 3);
    let backRandomCar = new Car(
      road.getLaneCenter(backRandomLane),
      backRandomLocation,
      30,
      50,
      "AI",
      4
    );
    traffic.push(backRandomCar);
    console.log(
      `Back: Car generated at: ${backRandomCar} lane at: x=${backRandomCar}`
    );
  }
}
