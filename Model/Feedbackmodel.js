import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Feedback content is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Feedback', FeedbackSchema);
