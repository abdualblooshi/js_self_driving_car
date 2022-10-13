class Car {
  constructor(x, y, width, height, controlType) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;
    this.isMoving = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls(controlType);
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#checkCollision(roadBorders);
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

    this.sensor.update(roadBorders);
  }

  #checkCollision(roadBorders) {
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
    return false;
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
      console.log(this.angle);
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

    this.sensor.draw(ctx);
  }
}
