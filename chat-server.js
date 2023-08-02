const net = require("node:net");

const Users = require("./src/users");
const Sockets = require("./src/sockets");
const ChatApp = require("./src/chat-app");
const SocketHandler = require("./src/socket-handler");

const main = () => {
  const chatServer = net.createServer();
  const chatApp = new ChatApp(new Users(), new Sockets());

  chatServer.on("connection", (socket) => {
    console.log("New user joined");
    chatApp.setupConnection(new SocketHandler(socket));
  });

  chatServer.listen(8000);
};

main();
