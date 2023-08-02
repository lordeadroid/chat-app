class ClientView {
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;
  }

  display(chats) {
    chats.forEach((chat) => {
      this.#renderer.log(chat.sender + " >> " + chat.message);
    });
  }
}

module.exports = ClientView;
