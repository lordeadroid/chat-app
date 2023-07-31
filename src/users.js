const User = require("./user");

class Users {
  #users;
  #messages;

  constructor() {
    this.#users = {};
    this.#messages = [];
  }

  #greet(name) {
    return `Hello, ${name}\n`;
  }

  #displayMenu() {
    return (
      "Please select a chat" +
      "\n" +
      `${Object.keys(this.#users)}` +
      "\n" +
      "Type 'open [username]' to open a chat" +
      "\n" +
      "By default groupChat is selected" +
      "\n"
    );
  }

  #displayUnreadMessages(user) {
    this.#messages.forEach(({ name, message }) => user.write(name, message));
  }

  #getAllUsers(currentUser) {
    return Object.values(this.#users).filter(
      (user) => user.name !== currentUser
    );
  }

  #openDM(message, updateRecipients) {
    const [_, username] = message.split(" ");
    updateRecipients([this.#users[username]]);
  }

  handleConnection(socket) {
    socket.setEncoding("utf-8");
    socket.write("Enter your name : ");

    socket.once("data", (data) => {
      const name = data.trim();
      const user = new User(socket, name);

      this.#users[name] = user;
      user.write(this.#greet(name));
      socket.write(this.#displayMenu());

      Object.values(this.#users).forEach((user) =>
        user.updateRecipients(this.#getAllUsers(user.name))
      );

      user.broadcast((message, cb) => this.#openDM(message, cb));
    });
  }
}

module.exports = Users;
