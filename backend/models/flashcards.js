import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  folder: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  note_name: { type: String, required: true },
  format: { type: String, required: true },
  status: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
});

const Flashcard = mongoose.model("notes", flashcardSchema);

export default Flashcard;
