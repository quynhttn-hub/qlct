const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRouter = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const friendRoutes = require("./routes/friendRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

dotenv.config();
connectDB();

// Cấu hình CORS cho Express
app.use(
  cors({
    origin: "*", // Thay đổi thành domain của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // to accept json data
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/income", incomeRoutes);


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`.yellow.bold);
});

// Cấu hình Socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // Thay đổi thành domain của bạn
  },
});

const queue = [];

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("User joined:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    queue.push(newMessageRecieved);

    while (queue.length > 0) {
       var message = queue.shift();
       var chat = message.chat;

      if (!chat.users) return console.log("chat.users not defined");
      chat.users.forEach((user) => {
        const userId = user._id || user.id;
        const senderId = message.sender._id || message.sender.id;
         if (userId === senderId ) return;

         socket.in(userId).emit("message recieved", message);
       });
    }
    
   
  });

  socket.on("new notification", (notification) => {
    var senderId = notification.sendId;

    socket
      .in(senderId)
      .emit("notification received", {
        avatar: notification.avatar,
        username: notification.username,
        id: notification.id,
      });
  });



  socket.on("disconnect", (userData) => {
    // console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
