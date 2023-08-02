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

  #startConversing(data, sender) {
    const { action, receiver, message } = JSON.parse(data);

    if (action === "PUT") {
      const recipients =
        receiver !== "group" ? [receiver] : this.#users.getOtherUsers(sender);

      this.#users.send(sender, receiver, message);
      this.#users.receive(sender, recipients, message);
      this.#sockets.write(recipients, { sender, receiver, message });
    }
  }

  setupConnection(socket) {
    const response = {
      isInvalid: true,
      sender: "server",
      message: "Enter your name : ",
    };

    socket.setEncoding("utf-8");
    socket.write(JSON.stringify(response));

    socket.once("data", (data) => {
      const { credentials } = JSON.parse(data);

      if (this.#users.isPresent(credentials))
        this.#sockets.removeSocket(credentials);
      if (this.#users.isNew(credentials))
        this.#users.addUser(new User(credentials));

      this.#sockets.addSocket(credentials, socket);

      response.message =
        "Hello, " +
        `${credentials}\n${this.#displayMenu()}\n` +
        `${this.#users.getUnreadMessages(credentials)}`;

      response.isInvalid = false;

      socket.write(JSON.stringify(response));

      socket.on("data", (data) => this.#startConversing(data, credentials));
    });
  }
}

module.exports = ChatApp;
