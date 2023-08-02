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

  #validateUser(username, socket) {
    if (this.#users.isPresent(username)) this.#sockets.removeSocket(username);
    if (this.#users.isNew(username)) this.#users.addUser(new User(username));

    this.#sockets.addSocket(username, socket);

    const chats = [
      {
        sender: "server",
        message: `Hello, ${username}\n${this.#displayMenu()}`,
      },
      ...this.#users.getMessages(username),
    ];

    return { chats, inValid: false };
  }

  #sendMessage(sender, receiver, message) {
    const recipients =
      receiver !== "group" ? [receiver] : this.#users.getOtherUsers(sender);

    this.#users.send(sender, receiver, message);
    this.#users.receive(sender, recipients, message);
    this.#sockets.write(recipients, {
      sender,
      receiver,
      chats: [{ sender, message }],
    });
  }

  setupConnection(socket) {
    socket.setOnLoginAttempt((username, socket) =>
      this.#validateUser(username, socket)
    );

    socket.setOnNewMessage((sender, receiver, message) =>
      this.#sendMessage(sender, receiver, message)
    );

    socket.start();
  }
}

module.exports = ChatApp;
