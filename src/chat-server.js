const net = require("node:net");

const greetUser = (socket, name) => {
  const greeting = "Hello " + name;
  socket.write(greeting);
};

const handleConnection = (socket) => {
  console.log("New user joined");
  socket.write("Enter your name : ");
  socket.once("data", (data) => greetUser(socket, data));
};

const main = () => {
  const chatServer = net.createServer();

  chatServer.listen(8000);
  chatServer.on("connection", handleConnection);
};

main();
