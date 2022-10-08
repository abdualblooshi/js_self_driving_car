class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0;

    this.controls = new Controls();
  }

  update() {
    if (this.controls.forward) {
      this.acceleration = 0.1;
    } else if (this.controls.reverse) {
      this.acceleration = -0.1;
    } else {
      this.acceleration = 0;
    }

    if (this.controls.left) {
      this.x -= 5;
    } else if (this.controls.right) {
      this.x += 5;
    }

    this.speed += this.acceleration;
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
