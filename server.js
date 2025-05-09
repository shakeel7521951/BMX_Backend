import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectD from "./ConnectDb/ConnectDB.js";
import Userroute from "./Route/UserRoute.js";
import TaskRoute from "./Route/TaskRoute.js";
import withdrawRoute from "./Route/Withdraw.js";
import Error from "./MiddleWare/Error.js";

process.on("uncaughtException", (err) => {
  console.error(`Uncaught exception: ${err.message}`);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = [
  "https://bmxadventure.com",
  "https://www.bmxadventure.com",
  "http://localhost:5174"
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Root route to check if the backend is running
app.get("/", (req, res) => {
  res.send("Backend is running.......");
});

app.use(cookieParser());

// Routes for handling user, task, and withdrawal
app.use("/api/v1", Userroute);
app.use("/api/v1", TaskRoute);
app.use("/api/v1", withdrawRoute);

// Global Error handler
app.use(Error);

const Server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectD();  // Connect to database
});

// Graceful shutdown for unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log("Server rejected");
  console.error(`Unhandled Rejection: ${err.message}`);
  Server.close(() => {
    process.exit(1);
  });
});
