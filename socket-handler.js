class SocketHandler {
  #socket;
  #onNewMessage;
  #onLoginAttempt;

  constructor(socket) {
    this.#socket = socket;
    this.#socket.setEncoding("utf-8");
  }

  #askCredentials() {
    const response = {
      response: "VALIDATE",
      chats: [{ sender: "server", message: "Enter your name : " }],
    };

    this.#socket.write(JSON.stringify(response));
  }

  setOnLoginAttempt(cb) {
    this.#onLoginAttempt = cb;
  }

  setOnNewMessage(cb) {
    this.#onNewMessage = cb;
  }

  #login(username) {
    const response = this.#onLoginAttempt(username, this.#socket);

    if (response.inValid) {
      this.#askCredentials();
      return;
    }

    this.#write(response);
  }

  #write(data) {
    this.#socket.write(JSON.stringify(data));
  }

  start() {
    let sender;
    this.#socket.on("data", (data) => {
      const { action, username, receiver, message } = JSON.parse(data);

      switch (action) {
        case "VALIDATE":
          sender = username;
          this.#login(username);
          break;

        case "PUT":
          this.#onNewMessage(sender, receiver, message);
          break;
      }
    });

    this.#askCredentials();
  }
}

module.exports = SocketHandler;
