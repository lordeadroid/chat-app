class User {
  #name;
  #socket;

  constructor(socket, name) {
    this.#name = name;
    this.#socket = socket;
  }

  greet() {
    const greeting = "Hello, " + this.#name;
    this.#socket.write(greeting);
  }

  write(data) {
    this.#socket.write(data);
  }

  isDistinct(socket) {
    return this.#socket !== socket;
  }
}

module.exports = User;
