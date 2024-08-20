import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    folder: { type: String, required: true },
    note_content: { type: String, required: true },
    note_format: { type: String, required: true },
    note_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;