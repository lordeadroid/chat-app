class User {
  #name;
  #socket;
  #messages;
  #recipients;

  constructor(socket, name) {
    this.#name = name;
    this.#messages = [];
    this.#recipients = [];
    this.#socket = socket;
  }

  write(sender, message) {
    const messageToDisplay = `${sender} >> ${message}\n`;

    this.#messages.push({ sender, message });
    this.#socket.write(messageToDisplay);
  }

  broadcast(openDM) {
    this.#socket.on("data", (message) => {
      if (message.startsWith("open ")) {
        openDM(message, (recipients) => this.updateRecipients(recipients));
        return;
      }

      this.#recipients.forEach((recipient) => {
        recipient.write(this.#name, message);
      });
    });
  }

  updateRecipients(recipients) {
    this.#recipients = recipients;
  }

  isDistinct(socket) {
    return this.#socket !== socket;
  }

  get name() {
    return this.#name;
  }
}

module.exports = User;
