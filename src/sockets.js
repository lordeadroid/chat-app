class Sockets {
  #sockets;

  constructor() {
    this.#sockets = {};
  }

  addSocket(name, socket) {
    this.#sockets[name] = socket;
  }

  write(recipients, message) {
    recipients.forEach((recipient) =>
      this.#sockets[recipient].write(JSON.stringify(message))
    );
  }
}

module.exports = Sockets;
