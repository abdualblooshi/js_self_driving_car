/*
  Author : @gitanimous
  Main script file
  - contains the simulation loop and render functions
*/

const message = document.getElementById("message");
const messageTitle = document.getElementById("title");
const messageText = document.getElementById("messageText");

const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const cars = generateNetworkCars(100);
const traffic = generateRandomCars(100);
traffic.push(new Car(road.getLaneCenter(1), -200, 30, 50, "DUMMY", 2.5, 2));

let bestCar = cars[0];
if (localStorage.getItem("bestCar")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestCar"));
}

function setMessage(title, text) {
  message.style.display = "flex";
  messageTitle.innerHTML = title;
  messageText.innerHTML = text;
  animateMessage();
}

function animateMessage() {
  setTimeout(() => {
    message.style.display = "flex";
  }, 3500);
  setTimeout(() => {
    message.style.display = "none";
  }, 3500);
}

function generateRandomCars(N) {
  let cars = [];
  for (let i = 0; i < N; i++) {
    let randomLane = Math.floor(Math.random() * 3);
    cars.push(
      new Car(
        road.getLaneCenter(randomLane),
        differentRandomNumber(-1000, -30000),
        30,
        50,
        "DUMMY",
        2.5,
        2
      )
    );
  }
  return cars;
}

function generateNetworkCars(N) {
  let cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 4));
  }
  return cars;
}

animate();

function store() {
  const bestCar = cars.find(
    (car) => car.y == Math.min(...cars.map((car) => car.y))
  );
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  setMessage("💿 Stored", "The best car's brain has been stored");
}

function discard() {
  localStorage.removeItem("bestBrain");
  setMessage("🗑️ Discarded", "The best car's brain has been discarded");
}

function animate(time) {
  traffic.forEach((car) => {
    car.update(road.borders, []);
  });

  cars.forEach((car) => {
    car.update(road.borders, traffic);
  });

  const bestCar = cars.find(
    (car) => car.y == Math.min(...cars.map((car) => car.y))
  );

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height / 1.5);

  road.draw(carCtx);
  traffic.forEach((trafficCar) => {
    trafficCar.draw(carCtx);
  });

  carCtx.globalAlpha = 0.2;

  cars.forEach((car) => {
    car.draw(carCtx);
  });
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);
  carCtx.restore();

  networkCtx.lineDashOffset = time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
