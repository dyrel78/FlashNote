import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

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

// POST route for user login
// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;


console.log(email + " " + password);
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashPass = /^\$2y\$/.test(user.password) ? '$2a$' + user.password.slice(4) : user.password;
    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, hashPass);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If the password is correct, return success
    return res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
});
// Get user by username
router.get("/username/:username", async (req, res) => {
  const usernameVar = req.params.username;
  try {
    const user = await User.findOne({ usernameVar });
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
    const saltRounds = 10;
    
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
