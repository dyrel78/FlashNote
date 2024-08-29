import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import multer from "multer";
import session from "express-session";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import usersRoute from "./routers/userRoute.js";
import notesRoute from "./routers/notesRoute.js";
const app = express();
const port = process.env.PORT || 8080;
import cors from "cors";
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import router from "./routes.js";
app.use(express.static(path.join(__dirname, "frontend", "dist")));


app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use("/api/users", usersRoute);
app.use("/api/notes", notesRoute);
// app.use("/",router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend","dist", "index.html"));
});
//Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
  })
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Click here to open the app: http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
