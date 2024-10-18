import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import usersRoute from "./routers/userRoute.js";
import notesRoute from "./routers/notesRoute.js";
import llmRoutes from "./routers/llmRoutes.js";
import pdfRoutes from "./routers/pdfRoute.js";
import cors from "cors";
import http from "http"; // Importing http module to create the server

const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, "Frontend/dist")));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", usersRoute);
app.use("/api/notes", notesRoute);
app.use("/api/llm", llmRoutes);
app.use("/api/pdf", pdfRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/dist", "index.html"));
});

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");

    // Create the server with increased header size
    const server = http.createServer(
      {
        maxHeaderSize: 128000, // Increase header size limit to 16KB (adjust as needed)
      },
      app
    );

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Click here to open the app: http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

export default app;
