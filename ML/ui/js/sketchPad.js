class SketchPad {
  constructor(container, onUpdate = null, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
    background-color:white;
    box-shadow: 0px 0px 10px 2px black;
    `;
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.drawingStarted = false;
    this.paths = [];
    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);
    this.undoBtn = document.createElement("button");
    this.undoBtn.innerHTML = "Undo";
    container.appendChild(this.undoBtn);
    this.undoBtn.disabled = true;
    this.onUpdate = onUpdate;
    this.#addEventListener();
  }

  //draw lines using users mouse movement
  #addEventListener() {
    // get co-ordinates
    this.canvas.onmousedown = (e) => {
      this.paths.push([this.#getMouse(e)]);
      this.drawingStarted = true;
      this.undoBtn.disabled = false;
    };

    this.canvas.onmousemove = (e) => {
      if (this.drawingStarted) {
        //push path to the lastPath
        this.paths[this.paths.length - 1].push(this.#getMouse(e));
        this.#redraw();
      }
    };
    document.onmouseup = (e) => {
      if (this.drawingStarted) {
        this.drawingStarted = false;
      }
    };

    //handle mobile touch screens
    this.canvas.ontouchstart = (e) => this.canvas.onmousedown(e.touches[0]);
    this.canvas.ontouchmove = (e) => this.canvas.onmousemove(e.touches[0]);
    document.ontouchend = (e) => this.canvas.onmouseup(e.touches[0]);

    this.undoBtn.onclick = (e) => {
      this.paths.pop();
      this.#redraw();
      if (this.paths.length == 0) {
        this.undoBtn.disabled = true;
      }
    };
  }

  #getMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = [e.clientX - rect.left, e.clientY - rect.top].map((value) =>
      Math.round(value)
    );
    return mouse;
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
    this.triggerUpdate();
  }

  reset() {
    this.paths = [];
    this.drawingStarted = false;
    this.#redraw();
  }

  triggerUpdate() {
    if (this.onUpdate) {
      this.onUpdate(this.paths);
    }
  }
}
