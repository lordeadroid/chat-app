class ChatApp {
  #database;
  #sockets;

  constructor(database, sockets) {
    this.#sockets = sockets;
    this.#database = database;
  }

  #validateUser(username, socket) {
    if (this.#database.isPresent(username))
      this.#sockets.removeSocket(username);
    if (this.#database.isNewUser(username)) this.#database.addUser(username);

    this.#sockets.addSocket(username, socket);

    return {
      inValid: false,
      chats: [{ sender: "server", message: `Hello, ${username}` }],
    };
  }

  #sendMessage(sender, receiver, message) {
    if (this.#database.isNewUser(receiver)) return;

    this.#database.storeDirectChats(sender, receiver, message);
    this.#sockets.write([receiver], {
      chats: [{ sender, message }],
    });
  }

  #getChat(sender, receiver) {
    if (this.#database.isNewUser(receiver))
      return {
        chats: [{ sender: "server", message: `${receiver} is not a user` }],
      };

    const chats = this.#database.connect(sender, receiver);
    chats.unshift({ sender: "server", message: `connected with ${receiver}` });

    return { chats };
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
