class Car {
  constructor(
    x,
    y,
    width,
    height,
    controlType,
    maxSpeed = 3,
    acceleration = 0.1
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = acceleration;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;
    this.isMoving = false;

    this.useBrain = controlType == "AI";

    this.target = null;

    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }

    this.controls = new Controls(controlType);
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#checkCollision(roadBorders, traffic);
    }
    if (this.damaged) {
      this.isMoving = false;
      let message = document.getElementById("message");
      let messageText = document.getElementById("messageText");
      let title = document.getElementById("title");
      title.style.display = "none";
      message.style.display = "flex";
      message.style.flexDirection = "column";
      message.style.alignItems = "center";
      message.style.justifyContent = "center";
      message.style.height = "50px";
      messageText.innerHTML = "<h1>💥 You crashed!</h1>";
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((reading) =>
        reading === null ? 0 : 1 - reading.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  linesIntersect(a, b, c, d) {
    const det = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
    if (det === 0) {
      return false;
    } else {
      const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / det;
      const u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / det;
      return t > 0 && t < 1 && u > 0;
    }
  }

  polysIntersect(p1, p2) {
    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        if (
          this.linesIntersect(
            p1[i],
            p1[(i + 1) % p1.length],
            p2[j],
            p2[(j + 1) % p2.length]
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  #checkCollision(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      const border = roadBorders[i];
      const touch = getIntersection(
        this.polygon[0],
        this.polygon[1],
        border[0],
        border[1]
      );
      if (touch) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const car = traffic[i];
      if (car != this) {
        if (polysIntersect(this.polygon, car.polygon)) {
          return true;
        }
      }
    }
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  setTarget(target) {
    this.target = target;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      this.isMoving = true;
      let message = document.getElementById("message");
      message.style.display = "none";
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
      if (this.controls.straighten) {
        if (this.angle > 0) {
          this.angle -= 0.03;
        }
        if (this.angle < 0) {
          this.angle += 0.03;
        }
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    if (this.damaged) {
      ctx.fillStyle = "#FF0000";
    }

    if (!this.damaged) {
      ctx.fillStyle = "#000000";
    }

    ctx.fill();
    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
