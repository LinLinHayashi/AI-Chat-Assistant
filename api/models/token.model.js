import mongoose from 'mongoose';

// Create a schema in the MongoDB collection.
const tokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  userToken: {
    type: String,
    required: true,
  }
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;