import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import statusRoutes from './routes/statusRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => console.error(' Mongo Error:', err));

// Routes
app.use('/api/statuses', statusRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
