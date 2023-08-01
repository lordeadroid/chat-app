class User {
  #name;
  #messages;

  constructor(username) {
    this.#name = username;
    this.#messages = {
      sent: [],
      received: [],
    };
  }

  send(recipient, message) {
    this.#messages.sent.push({ recipient, message });
  }

  receive(sender, message) {
    this.#messages.received.push({ sender, message });
  }

  getSentMessagesTo(username) {
    return this.#messages.sent.filter(
      (message) => message.recipient === username
    );
  }

  getReceivedMessagesFrom(username) {
    return this.#messages.received.filter(
      (message) => message.sender === username
    );
  }

  get name() {
    return this.#name;
  }
}

module.exports = User;
