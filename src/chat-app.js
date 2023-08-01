const User = require("./user");

class ChatApp {
  #users;
  #sockets;

  constructor(users, sockets) {
    this.#users = users;
    this.#sockets = sockets;
  }

  #displayMenu() {
    return (
      "Type 'open [username]' to open a chat" +
      "\n" +
      "By default group chat is selected" +
      "\n" +
      `Registered users: ${this.#users.registeredUsers.join(", ")}`
    );
  }

  #startConversing(data) {
    const { sender, receiver, message } = JSON.parse(data);

    const recipients =
      receiver !== "group" ? [receiver] : this.#users.getOtherUsers(sender);

    this.#users.send(sender, receiver, message);
    this.#users.receive(sender, recipients, message);
    this.#sockets.write(recipients, { sender, receiver, message });
  }

  setupConnection(socket) {
    const response = {
      sender: "server",
      receiver: "group",
      message: "Enter your name : ",
    };

    socket.setEncoding("utf-8");
    socket.write(JSON.stringify(response));

    socket.once("data", (data) => {
      const { sender } = JSON.parse(data);

      this.#users.addUser(new User(sender));
      this.#sockets.addSocket(sender, socket);

      response.message =
        "Hello, " +
        `${sender}\n${this.#displayMenu()}\n` +
        `${this.#users.getUnreadMessages(sender)}`;

      socket.write(JSON.stringify(response));
      response.sender = sender;

      socket.on("data", (data) => this.#startConversing(data));
    });
  }
}

module.exports = ChatApp;
