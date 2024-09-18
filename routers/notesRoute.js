import express from "express";
import mongoose from "mongoose";
import Note from "../models/note.js";
import User from "../models/user.js";

const router = express.Router();

// Create a new note
router.post("/", async (req, res) => {
  try {
    const { folder, note_content, note_format, note_name, user } = req.body;
    console.log(req.body);

    const newNote = new Note({
      folder,
      note_content,
      note_format,
      note_name,
      user,
    });

    await newNote.save();
    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().populate("user", "username");
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a note by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "username");

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res
      .status(200)
      .json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all notes by a specific user (using username)
router.get("user/:username", async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all notes for that user
    const notes = await Note.find({ user: user._id }).populate(
      "user",
      "username"
    );
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a note by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
