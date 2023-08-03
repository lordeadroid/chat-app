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
    user.store(sender, recipient, message);
  }

  receive(sender, recipient, message) {
    const user = this.#users[recipient];
    user.store(sender, recipient, message);
  }

  getMessages(username) {
    return this.#users[username].getChat();
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
