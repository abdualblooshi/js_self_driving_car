/*
    Author : @gitanimous
    Sensor System
    - Simulates a sensor/camera/radar system that can detect objects in the road ahead of the car. 
    - The sensor is mounted on the car and can be rotated to point in any direction. 
    - The sensor can detect objects in the road ahead of the car and can be used to 
    - detect other cars, pedestrians, and obstacles.
*/

class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 100;
    this.raySpread = Math.PI / 4; // 45 degrees
    this.rays = [];
  }

  update() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        i / (this.rayCount - 1)
      );

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - this.rayLength * Math.sin(rayAngle),
        y: this.car.y - this.rayLength * Math.cos(rayAngle),
      };
      this.rays.push([start, end]);
    }
  }
  draw(ctx) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      ctx.beginPath();
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(ray[1].x, ray[1].y);
      ctx.stroke();
    }
  }
}
