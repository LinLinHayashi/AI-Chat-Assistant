import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  chat: {
    type: Array,
    required: true
  },
  userRef: {
    type: String,
    required: true
  }
}, {timestamps: true});

const History = mongoose.model('History', historySchema);
export default History;