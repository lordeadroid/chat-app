const net = require("node:net");

const Users = require("./src/users");
const Sockets = require("./src/sockets");
const ChatApp = require("./src/chat-app");

const main = () => {
  const chatServer = net.createServer();
  const chatApp = new ChatApp(new Users(), new Sockets());

  chatServer.on("connection", (socket) => {
    console.log("New user joined");
    chatApp.setupConnection(socket);
  });

  chatServer.listen(8000);
};

main();
