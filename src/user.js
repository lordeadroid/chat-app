class User {
  #name;
  #messages;

  constructor(username) {
    this.#name = username;
    this.#messages = [];
  }

  store(sender, recipient, message) {
    const type = sender === this.#name ? "sent" : "received";

    this.#messages.push({
      type,
      sender,
      message,
      recipient,
    });
  }

  getChat() {
    return JSON.parse(JSON.stringify(this.#messages));
  }

  get name() {
    return this.#name;
  }
}

module.exports = User;
