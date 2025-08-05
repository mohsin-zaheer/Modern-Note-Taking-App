import express from 'express';
import Note from '../models/Note.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔐 Get all notes for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Get a single note
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }

    res.json(note);
  } catch (err) {
    res.status(404).json({ message: 'Note not found' });
  }
});

// 🔐 Create a note
router.post('/', protect, async (req, res) => {
  const { title, desc, date, important } = req.body;

  if (!title || !desc) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const newNote = new Note({
      title,
      desc,
      date,
      important,
      user: req.user._id,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔐 Update a note
router.put('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    // ✅ Update all fields safely
    note.title = req.body.title ?? note.title;
    note.desc = req.body.desc ?? note.desc;
    note.date = req.body.date ?? note.date;
    note.important = req.body.important ?? note.important;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔐 Delete a note
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
