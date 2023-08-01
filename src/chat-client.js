const net = require("node:net");

const displayMessage = (sender, message) => {
  console.log(sender + " >> " + message);
};

const setupClient = () => {
  const chatClient = net.createConnection(8000);

  chatClient.on("connect", () => {
    const response = { sender: "", receiver: "group" };

    chatClient.setEncoding("utf-8");
    process.stdin.setEncoding("utf-8");

    process.stdin.once("data", (data) => {
      const username = data.trim();

      response.sender = username;
      response.message = username;
      chatClient.write(JSON.stringify(response));

      process.stdin.on("data", (data) => {
        const message = data.trim();

        if (message === "END") {
          chatClient.end();
          return;
        }

        if (message.startsWith("open ")) {
          const [_, username] = message.split(" ");
          response.receiver = username;
          console.log("Messages will go to", username);
          return;
        }

        response.message = data.trim();
        chatClient.write(JSON.stringify(response));
      });
    });

    chatClient.on("data", (data) => {
      const { sender, message } = JSON.parse(data);
      displayMessage(sender, message);
    });

    chatClient.on("end", () => {
      console.log("Session ended");
      process.exit(0);
    });
  });
};

setupClient();
