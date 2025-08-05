import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password , imageUrl } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, username, email, password, imageUrl });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      image: user.imageUrl,
      createdAt: user.createdAt, 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.imageUrl,
      token: generateToken(user._id),
      createdAt: user.createdAt, 
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

router.put('/profile-pic', protect,  async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.image = req.body.imageUrl;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      image: user.image,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
