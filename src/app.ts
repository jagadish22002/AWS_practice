
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from './db/models/user';
import cors from 'cors'

// Define constants for MongoDB credentials and connection options
const MONGO_USERNAME = 'Jagadish1122';
const MONGO_PASSWORD = 'jagadish';
const MONGO_CLUSTER = 'ambulance.w822gx4.mongodb.net';
const MONGO_DB_NAME = 'ambulance';
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

// Express setup
const app = express();
const port = 3000;

app.use(cors());

// Mongoose connection function
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
   
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    });
    console.log('Successfully connected to MongoDB using Mongoose!');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit if connection fails
  }
}

// Define a test route
app.use(express.json());

// Route to create a new user
app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password, // In a real-world app, you'd hash the password before storing it
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error,
    });
  }
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error,
    });
  }
});
// Start the Express server
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  // Connect to MongoDB when the server starts
  await connectToMongoDB();
});

// Ensure MongoDB client is closed when the app stops
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

