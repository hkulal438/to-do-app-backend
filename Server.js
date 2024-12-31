const express = require("express");
const mongoose = require("mongoose");
const cors= require("cors")
const routes = require('./routes/ToDoRout') 
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;  
app.use(express.json())
app.use(cors())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); 
  });
app.use(routes)

// Function to start the server and handle EADDRINUSE error
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use. Trying port ${port + 1}...`);
      startServer(port + 1); // Try the next port
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

// Start server on the initial port (5000)
startServer(PORT);
