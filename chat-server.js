const net = require("node:net");

const Sockets = require("./src/sockets");
const ChatApp = require("./src/chat-app");
const Database = require("./src/database");
const SocketHandler = require("./src/socket-handler");

const main = () => {
  const chatServer = net.createServer();
  const chatApp = new ChatApp(new Database(), new Soqckets());

  chatServer.on("connection", (socket) => {
    console.log("New user joined");
    chatApp.setupConnection(new SocketHandler(socket));
  });

  chatServer.listen(8000);
};

main();
