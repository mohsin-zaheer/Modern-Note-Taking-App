// index.js
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/upload.js';
import dotenv from 'dotenv';

const app = express();
const PORT = 8080;

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/upload', uploadRoutes);


app.use('/api/healthz', (_req, res) => {
  res.status(200).send('ok');
})


// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => console.log(`API sucessfully running on port ${PORT}`));
});
