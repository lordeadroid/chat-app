const net = require("node:net");
const Users = require("./users");
const ChatApp = require("./chat-app");
const Sockets = require("./sockets");

const main = () => {
  const chatServer = net.createServer();
  const chatApp = new ChatApp(new Users(), new Sockets());

  chatServer.on("connection", (socket) => {
    console.log("New user joined");
    chatApp.handleConnection(socket);
  });

  chatServer.listen(8000);
};

main();
