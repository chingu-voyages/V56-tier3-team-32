import express, { response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import patientRoutes from './routes/patientRoutes';
import statusRoutes from './routes/statusRoutes';
import { request } from 'http';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const mongoUri = process.env.SURGERY_DATABASE_CONNECTION_CREDENTIALS;
    if (!mongoUri) {
      throw new Error(
        'MongoDB connection string not found in environment variables'
      );
    }

    await mongoose.connect(mongoUri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Surgery Status API is running!' });
});

// Admin routes for patient management
app.use('/admin', patientRoutes);

//Routes for status management
app.use('/statuses', statusRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
