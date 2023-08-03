const User = require("./user");

class ChatApp {
  #users;
  #sockets;

  constructor(users, sockets) {
    this.#users = users;
    this.#sockets = sockets;
  }

  #validateUser(username, socket) {
    if (this.#users.isPresent(username)) this.#sockets.removeSocket(username);
    if (this.#users.isNew(username)) this.#users.addUser(new User(username));

    this.#sockets.addSocket(username, socket);
    return {
      inValid: false,
      chats: [{ sender: "server", message: `Hello, ${username}` }]
    };
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
    if (this.#users.isNew(receiver)) return {
      chats: [{ sender: "server", message: `${receiver} is not a user` }]
    };

    const chats = this.#users
      .getMessages(sender)
      .filter(
        (message) =>
          message.sender === receiver || message.recipient === receiver
      );

    chats.unshift({ sender: "server", message: `connected with ${receiver}` });
    return { chats }
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
