class Users {
  #users;

  constructor() {
    this.#users = {};
  }

  addUser(user) {
    this.#users[user.name] = user;
  }

  send(sender, recipient, message) {
    const user = this.#users[sender];
    user.send(recipient, message);
  }

  receive(sender, recipients, message) {
    recipients.forEach((recipient) => {
      const user = this.#users[recipient];
      user.receive(sender, message);
    });
  }

  getUnreadMessages(username) {
    const unreadMessages = [];

    Object.values(this.#users).forEach((user) => {
      const groupMessages = user.getSentMessagesTo("group");
      const userMessages = user.getSentMessagesTo(username);

      unreadMessages.push(...userMessages, ...groupMessages);
    });

    return unreadMessages.join("\n");
  }

  getOtherUsers(username) {
    return Object.keys(this.#users).filter((name) => name !== username);
  }

  isPresent(username) {
    return username in this.#users;
  }

  isNew(username) {
    return !this.isPresent(username);
  }

  get registeredUsers() {
    return Object.keys(this.#users);
  }
}

module.exports = Users;
