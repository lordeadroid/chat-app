const net = require("node:net");

const displayMessage = (data) => {
  console.log(data.trim());
};

const sendMessage = (inputStream, chatClient, message) => {
  if (message === "END") {
    chatClient.end();
    inputStream.removeAllListeners();
    return;
  }

  chatClient.write(message);
};

const setupClient = () => {
  const chatClient = net.createConnection(8000);

  chatClient.on("connect", () => {
    chatClient.setEncoding("utf-8");
    process.stdin.setEncoding("utf-8");

    process.stdin.on("data", (data) =>
      sendMessage(process.stdin, chatClient, data.trim())
    );

    chatClient.on("data", displayMessage);
  });
};

setupClient();
