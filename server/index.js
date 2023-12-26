const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const defaultRooms = [
  {
    key: "classroom1",
    value: "Classroom 1 Traninig",
  },
  {
    key: "classroom2",
    value: "Classroom 2 Traninig",
  },
  {
    key: "classroom3",
    value: "Classroom 3 Traninig",
  },
  {
    key: "classroom4",
    value: "Classroom 4 Traninig",
  },
  {
    key: "classroom5",
    value: "Classroom 5 Traninig",
  },
];

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  console.log("Joined User : ", socket.id);
  let __createdtime__ = Date.now();
  // console.log("name ", socket);
  socket.on("join", ({ name, room, userLang }, callback) => {
    console.log(name, room, userLang);
    // Add User To Room
    const { error, user } = addUser({ id: socket.id, name, room, userLang });
    if (error) return callback(error);

    socket.join(user.room);
    // Default Msg 1
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${defaultRooms.find((r, i) => r.key === user.room).value}.`,
      msgLang: "en",
    });

    // Default Msg 2
    socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} has joined!`, msgLang: "en" });

    io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
    // Get last 100 messages sent in the chat room
    harperGetMessages(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log("hit");
    io.to(user.room).emit("message", { user: user.name, text: message, msgLang: user.userLang });
    harperSaveMessage(user.name, user.room, message, user.userLang, __createdtime__) // Save message in db
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", { user: "Admin", text: `${user.name} has left.`, msgLang: "en" });
      io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(process.env.PORT || 4000, () => console.log(`Server has started. http://localhost:4000`));
