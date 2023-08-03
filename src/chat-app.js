class ChatApp {
  #users;
  #chats;
  #sockets;

  constructor(users, chats, sockets) {
    this.#users = users;
    this.#chats = chats;
    this.#sockets = sockets;
  }

  #validateUser(username, socket) {
    if (this.#users.isPresent(username)) this.#sockets.remove(username);
    if (this.#users.isNew(username)) this.#users.add(username);

    this.#sockets.add(username, socket);

    return {
      inValid: false,
      chats: [{ sender: "server", message: `Hello, ${username}` }],
    };
  }

  #sendMessage(sender, receiver, message) {
    if (this.#users.isNew(receiver)) return;

    this.#chats.add(sender, receiver, message);
    this.#sockets.write([receiver], {
      chats: [{ sender, message }],
    });
  }

  #getChat(sender, receiver) {
    if (this.#users.isNew(receiver))
      return {
        chats: [{ sender: "server", message: `${receiver} is not a user` }],
      };

    const chats = this.#chats.fetch(sender, receiver);
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
