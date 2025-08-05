import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/profile-image', upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path }); // Cloudinary URL
});

export default router;
