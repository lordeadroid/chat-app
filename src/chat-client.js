class ChatClient {
  #view;
  #socket;
  #inputStream;
  #currentChat;
  #sendResponse;

  constructor(socket, inputStream, view) {
    this.#view = view;
    this.#socket = socket;
    this.#currentChat = "group";
    this.#inputStream = inputStream;

    this.#socket.setEncoding("utf-8");
    this.#inputStream.setEncoding("utf-8");
  }

  #render(chats) {
    this.#view.display(chats);
  }

  #onInput(cb) {
    this.#sendResponse = cb;
  }

  #sendCredentials(username) {
    const response = {
      action: "VALIDATE",
      credentials: username,
    };

    this.#socket.write(JSON.stringify(response));
  }

  #sendMessages(message) {
    const response = {
      message,
      action: "PUT",
      receiver: this.#currentChat,
    };

    this.#socket.write(JSON.stringify(response));
  }

  #openChat(username) {
    const response = {
      username,
      action: "GET",
    };

    this.#currentChat = username;
    this.#socket.write(JSON.stringify(response));
  }

  #onData(data) {
    // const { response = ["G"], sender, message } = JSON.parse(data);
    const { isInvalid, chats } = JSON.parse(data);
    this.#render(chats);

    if (isInvalid) {
      this.#onInput((data) => this.#sendCredentials(data));
      return;
    }

    this.#onInput((data) => this.#sendMessages(data));
  }

  #onEnd() {
    this.#render("Session ended");
    process.exit(0);
  }

  setup() {
    this.#socket.on("end", () => this.#onEnd());
    this.#socket.on("data", (data) => this.#onData(data));

    this.#inputStream.on("data", (data) => {
      if (data === "END\n") {
        this.#socket.end();
        return;
      }

      if (data.startsWith("open ")) {
        const [_, username] = data.trim().split(" ");
        this.#openChat(username);
        return;
      }

      this.#sendResponse(data.trim());
    });
  }
}

module.exports = ChatClient;
