class ChatClient {
  #view;
  #socket;
  #recipient;
  #inputStream;
  #sendResponse;
  #isInCommandMode;

  constructor(socket, inputStream, view) {
    this.#view = view;
    this.#socket = socket;
    this.#isInCommandMode = false;
    this.#inputStream = inputStream;

    this.#socket.setEncoding("utf-8");
    this.#inputStream.setEncoding("utf-8");
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

  #getChat() {
    const response = {
      action: "GET",
      receiver: this.#recipient,
    };

    this.#socket.write(JSON.stringify(response));
  }

  #onData(data) {
    const { response, chats } = JSON.parse(data);

    this.#view.displayChats(chats);
    this.#sendResponse = (data) => this.#sendMessages(data);

    if (response === "VALIDATE")
      this.#sendResponse = (data) => this.#sendCredentials(data);
  }

  #onEnd() {
    this.#view.display("Session ended");
    this.#inputStream.destroy();
  }

  #handleCommands(command, argument) {
    switch (command) {
      case "END":
        this.#socket.end();
        break;
      case "CONNECT":
        this.#isInCommandMode = false;
        this.#recipient = argument;
        this.#view.clear();
        this.#getChat();
        break;
    }
  }

  setup() {
    this.#socket.on("end", () => this.#onEnd());
    this.#socket.on("data", (data) => this.#onData(data));

    this.#inputStream.on("data", (data) => {
      if (this.#isInCommandMode) {
        const [command, argument] = data.trim().split(" ");
        this.#handleCommands(command, argument);
        return;
      }

      if (data === "!home\n") {
        this.#view.clear();
        this.#isInCommandMode = true;
        this.#view.display("command mode");
        return;
      }

      this.#sendResponse(data.trim());
    });
  }
}

module.exports = ChatClient;
