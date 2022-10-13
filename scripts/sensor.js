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
    this.car = car; // The car that the sensor is mounted on
    this.rayCount = 5; // number of rays
    this.rayLength = 150; // pixels
    this.raySpread = Math.PI / 2; // 45 degrees
    this.rays = []; // array of ray start and end points

    this.readings = []; // array of ray readings
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      const reading = this.#getReading(ray, roadBorders, traffic);
      this.readings.push(reading);
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      poly.forEach((point, j) => {
        const touch = getIntersection(
          ray[0],
          ray[1],
          point,
          poly[(j + 1) % poly.length]
        );
        if (touch) {
          touches.push(touch);
        }
      });
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let end = ray[1];
      let reading = this.readings[i];
      if (reading) {
        end = reading;
      }
      ctx.beginPath();
      ctx.strokeStyle = "#fff000";
      ctx.lineWidth = 2;
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ff0000";
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
