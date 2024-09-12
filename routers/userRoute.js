import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET user by email and check password
router.get("/emailmail/:email", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches
    const isPasswordCorrect = await bcrypt.compare(
      req.query.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If the password is correct, return success
    return res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
});
// Get user by username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
// Tutorial for hashing
// https://www.honeybadger.io/blog/node-password-hashing/

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, username } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    // Log the error and send an error response
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// Update user by username
router.put("/username/:username", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true }
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid password" });
    } else {
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.username = username;
        res.json({ message: "Login successful" });
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user by username
router.delete("/username/:username", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });
    if (user) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
