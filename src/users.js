class Users {
  #users;

  constructor() {
    this.#users = new Set();
  }

  add(username) {
    if (this.#users.has(username)) return;
    this.#users.add(username);
  }

  isPresent(username) {
    return this.#users.has(username);
  }

  isNew(username) {
    return !this.isPresent(username);
  }
}

module.exports = Users;
