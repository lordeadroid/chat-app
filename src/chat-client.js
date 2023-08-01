const net = require("node:net");

const displayMessage = (sender, message) => {
  console.log(sender + " >> " + message);
};

const setupClient = () => {
  const chatClient = net.createConnection(8000);

  chatClient.on("connect", () => {
    const response = { sender: "", receiver: "" };

    chatClient.setEncoding("utf-8");
    process.stdin.setEncoding("utf-8");

    process.stdin.once("data", (data) => {
      const username = data.trim();

      response.sender = username;
      response.message = username;
      chatClient.write(JSON.stringify(response));

      process.stdin.on("data", (data) => {
        response.message = data.trim();
        chatClient.write(JSON.stringify(response));
      });
    });

    chatClient.on("data", (data) => {
      const { sender, receiver, message } = JSON.parse(data);

      response.receiver = receiver;
      displayMessage(sender, message);
    });
  });
};

setupClient();
