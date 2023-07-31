const net = require("node:net");
const Users = require("./users");

const main = () => {
  const users = new Users();
  const chatServer = net.createServer();

  chatServer.on("connection", (socket) => {
    console.log("New user joined");
    users.handleConnection(socket);
  });

  chatServer.listen(8000);
};

main();
