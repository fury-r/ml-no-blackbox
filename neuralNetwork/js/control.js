class Controls {
  constructor(type) {
    this.forward = false;
    this.right = false;
    this.left = false;
    this.reverse = false;
    switch (type) {
      case "KEYS":
        this.#addEventlistener();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }
  #updateStateBasedOnKey(key, state) {
    switch (key) {
      case "ArrowLeft":
        this.left = state;
        break;
      case "ArrowRight":
        this.right = state;
        break;
      case "ArrowUp":
        this.forward = state;
        break;
      case "ArrowDown":
        this.reverse = state;
        break;
    }
  }
  #addEventlistener() {
    document.onkeydown = (e) => this.#updateStateBasedOnKey(e.key, true);
    document.onkeyup = (e) => this.#updateStateBasedOnKey(e.key, false);
  }
}
