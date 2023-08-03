class ClientView {
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;
  }

  displayCommandMode() {
    this.#renderer.write("Command Mode enabled: \n");
    this.#renderer.write("Type `connect username` to connect to a user\n");
    this.#renderer.write("Type `!home` to come back in Command mode\n");
    this.#renderer.write("Type `END` to exit\n");
  }

  displayChats(chats = []) {
    chats.forEach((chat) => {
      this.#renderer.write(`${chat.sender} >> ${chat.message}\n`);
    });
  }

  clear() {
    const clearScreenHexCode = "\x1bc";
    this.#renderer.write(clearScreenHexCode);
  }

  display(message) {
    this.#renderer.write(message);
  }
}

module.exports = ClientView;
