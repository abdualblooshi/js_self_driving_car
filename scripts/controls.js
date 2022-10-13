class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
    this.straighten = false;
    this.leftCount = 0;
    this.rightCount = 0;

    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners();
        this.#addTouchListeners();
        break;
      case "AI":
        this.#addAILogic();
        break;
    }
  }

  #addAILogic() {
    setInterval(() => {
      this.reset();
      this.forward = true;
      this.straighten = true;
      if (Math.random() > 0.5) {
        this.left = true;
        this.leftCount = Math.floor(Math.random() * 10);
      } else {
        this.right = true;
        this.rightCount = Math.floor(Math.random() * 10);
      }
    }, 1000);
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;

        case "ArrowRight":
          this.right = true;
          break;

        case "ArrowUp":
          this.forward = true;
          break;

        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;

        case "ArrowRight":
          this.right = false;
          break;

        case "ArrowUp":
          this.forward = false;
          break;

        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }

  #addTouchListeners() {
    document.addEventListener("touchstart", (event) => {
      event.preventDefault();
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        if (event.touches.length === 1) {
          this.forward = true;
          if (event.target.id === "leftSide") {
            this.left = true;
            this.leftCount++;
            setTimeout(() => {
              this.left = false;
            }, 100);
          }
          if (event.target.id === "rightSide") {
            this.right = true;
            this.rightCount++;
            setTimeout(() => {
              this.right = false;
            }, 100);
          }

          if (event.target.id === "myCanvas") {
            if (this.leftCount > this.rightCount) {
              for (let i = 0; i < this.leftCount - this.rightCount; i++) {
                this.right = true;
                setTimeout(() => {
                  this.right = false;
                }, 100);
              }
              this.straighten = true;
              setTimeout(() => {
                this.straighten = false;
              }, 100);
            }
            if (this.rightCount > this.leftCount) {
              for (let i = 0; i < this.rightCount - this.leftCount; i++) {
                this.left = true;
                setTimeout(() => {
                  this.left = false;
                }, 100);
              }
              this.straighten = true;
              setTimeout(() => {
                this.straighten = false;
              }, 100);
            }

            this.leftCount = 0;
            this.rightCount = 0;
          }
        }
      }
    });
  }

  reset() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
  }
}
