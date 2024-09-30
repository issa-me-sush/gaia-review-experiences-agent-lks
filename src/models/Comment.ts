import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [10000, 'Comment cannot be more than 10000 characters'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);