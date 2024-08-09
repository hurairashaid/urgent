const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connect");

const PORT = process.env.PORT || 2000;
const app = express();

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });
// Routes
const blogRoutes = require("./routes/blog");
app.use("/api/blog", blogRoutes);

// Socket.io setup
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("what is socket ");
  console.log("socket is active to be connected");

  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (group) => {
    socket.join(group);
    console.log("user Joined Room " + group);
  });

  // socket.on("new message", (newMessageRecieved) => {
  //   socket.in(group).emit("message recieved", newMessageRecieved);
  // });

  socket.on("new message", (newMessageRecieved) => {
    const messageLength = newMessageRecieved.data.addMessage.messages.length;

    console.log(
      "this is the message",
      newMessageRecieved.data.addMessage.messages[messageLength - 1]
    );
    console.log("this is the group ID", newMessageRecieved.data.addMessage._id);
    socket.broadcast
      .to(newMessageRecieved.data.addMessage._id)
      .emit(
        "message recieved",
        newMessageRecieved.data.addMessage.messages[messageLength - 1]
      );
  });
});

httpServer.listen(3000, () => {
  console.log("server for socket is running");
});

// Start server
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB or any other database
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

startServer();
