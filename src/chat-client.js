class ChatClient {
  #view;
  #socket;
  #inputStream;
  #sendResponse;

  constructor(socket, inputStream, view) {
    this.#view = view;
    this.#socket = socket;
    this.#inputStream = inputStream;

    this.#socket.setEncoding("utf-8");
    this.#inputStream.setEncoding("utf-8");
  }

  #render(...messages) {
    this.#view.display(messages);
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
      receiver: "group",
    };

    this.#socket.write(JSON.stringify(response));
  }

  #onData(data) {
    const { isInvalid, sender, message } = JSON.parse(data);
    this.#render(sender, message);

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

      this.#sendResponse(data.trim());
    });
  }
}

module.exports = ChatClient;
