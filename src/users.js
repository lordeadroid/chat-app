const User = require("./user");

class Users {
  #users;

  constructor() {
    this.#users = [];
  }

  #broadcast(socket, data) {
    this.#users
      .filter((user) => user.isDistinct(socket))
      .forEach((user) => {
        user.write(data);
      });
  }

  handleConnection(socket) {
    socket.write("Enter your name : ");

    socket.once("data", (data) => {
      const name = data;
      const user = new User(socket, name);

      this.#users.push(user);
      user.greet();

      socket.on("data", (data) => {
        this.#broadcast(socket, data);
      });
    });
  }
}

module.exports = Users;
