const net = require("node:net");
const Users = require("./users");
const ChatApp = require("./chat-app");

const main = () => {
  const chatApp = new ChatApp(new Users());
  const chatServer = net.createServer();

  chatServer.on("connection", (socket) => {
    console.log("New user joined");
    chatApp.handleConnection(socket);
  });

  chatServer.listen(8000);
};

main();
