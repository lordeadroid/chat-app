const net = require("node:net");

const ChatClient = require("./src/chat-client");
const ClientView = require("./src/client-view");

const main = () => {
  const socket = net.createConnection(8000);
  const chatClient = new ChatClient(
    socket,
    process.stdin,
    new ClientView(console)
  );

  socket.on("connect", () => chatClient.setup());
};

main();
