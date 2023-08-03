class Sockets {
  #sockets;

  constructor() {
    this.#sockets = {};
  }

  add(name, socket) {
    this.#sockets[name] = socket;
  }

  remove(name) {
    this.#sockets[name].end();
    delete this.#sockets[name];
  }

  write(recipients, message) {
    recipients.forEach((recipient) => {
      this.#sockets[recipient].write(JSON.stringify(message));
    });
  }
}

module.exports = Sockets;
