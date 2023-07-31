class User {
  #name;
  #socket;

  constructor(socket, name) {
    this.#name = name;
    this.#socket = socket;
  }

  greet() {
    const greeting = `Hello, ${this.#name}\n`;
    this.#socket.write(greeting);
  }

  write(sender, message) {
    const messageToDisplay = `${sender} >> ${message}`;
    this.#socket.write(messageToDisplay);
  }

  onData(cb) {
    this.#socket.on("data", (data) => {
      cb(this.#name, data);
    });
  }

  isDistinct(socket) {
    return this.#socket !== socket;
  }
}

module.exports = User;
