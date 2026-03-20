import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not set');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown DB connection error';
    console.error(`MongoDB connection failed: ${message}`);
    console.log('Falling back to in-memory MongoDB (dev only)...');

    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB (in-memory) Connected: ${conn.connection.host}`);
  }
};
