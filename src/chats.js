class Chats {
  #chats;

  constructor() {
    this.#chats = [];
  }

  add(sender, receiver, message) {
    this.#chats.push({ sender, receiver, message });
  }

  fetch(sender, receiver) {
    const participants = [sender, receiver];

    return this.#chats.filter((chat) => {
      const isSender = (participant) => chat.sender === participant;
      const isReceiver = (participant) => chat.receiver === participant;

      return participants.some(isSender) && participants.some(isReceiver);
    });
  }
}

module.exports = Chats;
