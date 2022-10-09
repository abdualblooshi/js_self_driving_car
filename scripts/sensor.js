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
  }
}
