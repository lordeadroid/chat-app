const User = require("./user");

class Users {
  #users;

  constructor() {
    this.#users = [];
  }

  #broadcast(socket, name, data) {
    this.#users
      .filter((user) => user.isDistinct(socket))
      .forEach((user) => {
        user.write(name, data);
      });
  }

  handleConnection(socket) {
    socket.setEncoding("utf-8");
    socket.write("Enter your name : ");

    socket.once("data", (name) => {
      const user = new User(socket, name.trim());

      this.#users.push(user);
      user.greet();
      user.onData((name, data) => this.#broadcast(socket, name, data));
    });
  }
}

module.exports = Users;
