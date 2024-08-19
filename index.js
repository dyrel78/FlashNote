import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import multer from "multer";
import session from "express-session";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/Frontend/")));

app.get("*", (req, res) => {
  // res.send('index');
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Click here to open the app: http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
