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

// Route to get all notes for a specific user filtered by folder
router.get("/:userId/folder/:folderName", async (req, res) => {
  try {
    const userId = req.params.userId;
    const folderName = req.params.folderName;

    // Find all notes for the user in the specified folder
    const notes = await Note.find({ user: userId, folder: folderName });

    // Respond with the notes found in the folder
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes by folder:", error);
    res.status(500).json({ error: "An error occurred while fetching notes." });
  }
});
// Get all notes by a specific user (using user ID)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ user: userId }).populate(
      "user",
      "username"
    );

    if (!notes.length) {
      return res.status(404).json({ error: "No notes found for this user" });
    }

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route to get all unique folders for a specific user
router.get("/folders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all notes for the user
    const notes = await Note.find({ user: userId });

    // Extract folders and filter unique ones
    const folders = [...new Set(notes.map((note) => note.folder))];

    // Respond with the unique folders
    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching folders." });
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
