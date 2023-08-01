class Users {
  #users;

  constructor() {
    this.#users = {};
  }

  addUser(user) {
    this.#users[user.name] = user;
  }

  send(username, message) {
    const user = this.#users[username];
    user.send(username, message);
  }

  receive(username, message) {
    const user = this.#users[username];
    user.receive(username, message);
  }

  getUnreadMessages(username) {
    const unreadMessages = [];

    Object.values(this.#users).forEach((user) => {
      const groupMessages = user.getSentMessagesTo("all");
      const userMessages = user.getSentMessagesTo(username);

      unreadMessages.push(...userMessages, ...groupMessages);
    });

    return unreadMessages.join("\n");
  }

  getOtherUsers(username) {
    return Object.keys(this.#users).filter((name) => name !== username);
  }

  get registeredUsers() {
    return Object.keys(this.#users);
  }
}

module.exports = Users;
