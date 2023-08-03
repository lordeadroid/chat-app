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

  #openCommandMode() {
    this.#isInCommandMode = true;
    this.#view.displayCommandMode();
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

  #getChat(recipient) {
    const response = {
      action: "GET",
      receiver: recipient,
    };

    this.#recipient = recipient;
    this.#socket.write(JSON.stringify(response));
  }

  #onData(data) {
    const { inValid, chats } = JSON.parse(data);

    this.#view.displayChats(chats);
    this.#sendResponse = (data) => this.#sendMessages(data);

    if (inValid === false) {
      this.#openCommandMode();
      return;
    }

    if (inValid) this.#sendResponse = (data) => this.#sendCredentials(data);
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
        this.#getChat(argument);
        this.#view.clear();
        break;
    }
  }

  setup() {
    this.#view.display("Enter your name: ");
    this.#socket.on("end", () => this.#onEnd());
    this.#socket.on("data", (data) => this.#onData(data));
    this.#sendResponse = (username) => this.#sendCredentials(username);

    this.#inputStream.on("data", (data) => {
      if (this.#isInCommandMode) {
        const [command, argument] = data.trim().split(" ");
        this.#handleCommands(command.toUpperCase(), argument);
        return;
      }

      if (data === "!home\n") {
        this.#openCommandMode();
        return;
      }

      this.#sendResponse(data.trim());
    });
  }
}

module.exports = ChatClient;
