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
    ];

    return { chats, inValid: false };
  }

  #sendMessage(sender, receiver, message) {
    if (this.#users.isNew(receiver)) return;

    this.#users.send(sender, receiver, message);
    this.#users.receive(sender, receiver, message);
    this.#sockets.write([receiver], {
      sender,
      receiver,
      chats: [{ sender, message }],
    });
  }

  #getChat(sender, receiver) {
    if (this.#users.isNew(receiver)) return [];

    return this.#users
      .getMessages(sender)
      .filter(
        (message) =>
          message.sender === receiver || message.recipient === receiver
      );
  }

  setupConnection(socket) {
    socket.setOnLoginAttempt((username, socket) =>
      this.#validateUser(username, socket)
    );

    socket.setOnNewMessage((sender, receiver, message) =>
      this.#sendMessage(sender, receiver, message)
    );

    socket.setOnChatOpen((sender, receiver) => {
      return this.#getChat(sender, receiver);
    });

    socket.start();
  }
}

module.exports = ChatApp;
