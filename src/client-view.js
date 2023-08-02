class ClientView {
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;
  }

  displayChats(chats) {
    chats.forEach((chat) => {
      this.#renderer.log(chat.sender + " >> " + chat.message);
    });
  }

  clear() {
    this.#renderer.clear();
  }

  display(message) {
    this.#renderer.log(message);
  }
}

module.exports = ClientView;
