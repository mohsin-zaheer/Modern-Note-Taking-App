// index.js
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/upload.js';
import dotenv from 'dotenv';

const app = express();
const PORT = 5000;

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/upload', uploadRoutes);



// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
