import mongoose from 'mongoose';

// Create a schema in the MongoDB collection.
const resetTokenSchema = new mongoose.Schema({
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

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

export default ResetToken;