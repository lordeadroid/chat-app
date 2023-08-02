class ChatClient {
  #view;
  #socket;
  #recipient;
  #inputStream;
  #sendResponse;

  constructor(socket, inputStream, view) {
    this.#view = view;
    this.#socket = socket;
    this.#inputStream = inputStream;

    this.#socket.setEncoding("utf-8");
    this.#inputStream.setEncoding("utf-8");
  }

  #onInput(cb) {
    this.#sendResponse = cb;
  }

  #sendCredentials(username) {
    const response = {
      username,
      action: "VALIDATE",
    };

    this.#socket.write(JSON.stringify(response));
  }

  #sendMessages(message) {
    const response = {
      message,
      action: "PUT",
      receiver: this.#recipient,
    };

    this.#socket.write(JSON.stringify(response));
  }

  #getChat(username) {
    const response = {
      action: "GET",
      receiver: this.#recipient,
    };

    this.#socket.write(JSON.stringify(response));
  }

  #onData(data) {
    const { response, chats } = JSON.parse(data);

    this.#view.displayChats(chats);
    this.#onInput((data) => this.#sendMessages(data));

    if (response === "VALIDATE")
      this.#onInput((data) => this.#sendCredentials(data));
  }

  #onEnd() {
    this.#view.display("Session ended");
    this.#inputStream.destroy();
  }

  setup() {
    this.#socket.on("end", () => this.#onEnd());
    this.#socket.on("data", (data) => this.#onData(data));

    this.#inputStream.on("data", (data) => {
      if (data === "END\n") {
        this.#socket.end();
        return;
      }

      if (data.startsWith("connect ")) {
        const [_, username] = data.trim().split(" ");
        this.#recipient = username;
        this.#getChat(username);
        this.#view.clear();
        return;
      }

      this.#sendResponse(data.trim());
    });
  }
}

module.exports = ChatClient;
