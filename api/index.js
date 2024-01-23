import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.route.js';

dotenv.config(); // Validate the .env file.
const app = express(); // This creates the server.
app.use(express.json()); // This allows the server to accept requests with a JSON body.
// app.use(cors());

// Run the server.
app.listen(8000, () => {
  console.log('Server is running on port 8000!');
});

// This is how we call an API router.
app.use('/api/chat', chatRouter);
