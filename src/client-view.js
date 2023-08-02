class ClientView {
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;
  }

  display(messages) {
    this.#renderer(messages.join(" >> "));
  }
}

module.exports = ClientView;
