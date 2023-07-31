const User = require("./user");

class Users {
  #users;
  #messages;

  constructor() {
    this.#users = [];
    this.#messages = [];
  }

  #displayUnreadMessages(user) {
    this.#messages.forEach(({ name, message }) => user.write(name, message));
  }

  #broadcast(socket, name, message) {
    this.#messages.push({ name, message });

    this.#users
      .filter((user) => user.isDistinct(socket))
      .forEach((user) => {
        user.write(name, message);
      });
  }

  handleConnection(socket) {
    socket.setEncoding("utf-8");
    socket.write("Enter your name : ");

    socket.once("data", (data) => {
      const user = new User(socket, data.trim());

      this.#users.push(user);
      user.greet();
      this.#displayUnreadMessages(user);
      user.onData((name, message) => this.#broadcast(socket, name, message));
    });
  }
}

module.exports = Users;
