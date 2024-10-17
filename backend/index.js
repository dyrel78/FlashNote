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
// import cors from "cors";
// app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const allowedOrigins = [
  'http://3.217.34.111:8081',  // Your EC2 public IP and frontend port
  'http://3.217.34.111:8082',  // In case you're using the other frontend port
  'http://localhost:8081',      // For local development
  'http://ec2-3-217-34-111.compute-1.amazonaws.com:8080',
  'http://3.217.34.111:8080',
  'http://3.217.34.111',
  'http://www.flashnote.click',
  'http://www.flashnote.click:8080',
  'http://flashnote.click',
  'http://flashnote.click:8080',
  'http://www.flashnote.tech'

  // Add any other origins you need to allow
];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // This allows session cookies to be sent back and forth
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.static(path.join(__dirname, 'frontend','dist')));

// app.use(cors());
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

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
  // res.sendFile(path.join(__dirname, "Frontend","dist", "index.html"));
  try {
    // Works for docker
    res.sendFile(path.join(__dirname, 'frontend','dist', 'index.html'));

  } catch (error) {
    console.log(error);
    // Works for local
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));

  }
});
  // res.sendFile("/usr/src/frontend/dist/index.html");

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
// });

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
      console.log(`Click here to open the app: http://3.217.34.111:${port}`)
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

export default app;