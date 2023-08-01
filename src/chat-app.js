const User = require("./user");

class ChatApp {
  #users;

  constructor(users) {
    this.#users = users;
  }

  #displayMenu() {
    return (
      "Type 'open [username]' to open a chat" +
      "\n" +
      "By default group chat is selected" +
      "\n" +
      `Registered users: ${this.#users.registeredUsers.join(", ")}` +
      "\n"
    );
  }

  handleConnection(socket) {
    socket.setEncoding("utf-8");
    socket.write("Enter your name : ");

    socket.once("data", (data) => {
      const name = data.trim();

      this.#users.addUser(new User(name));
      socket.write(`Hello, ${name}\n`);
      socket.write(this.#displayMenu());
      socket.write(this.#users.getUnreadMessages(name));
    });
  }
}

module.exports = ChatApp;
