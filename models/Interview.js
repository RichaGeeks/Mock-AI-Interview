import { Schema, model, models } from 'mongoose';

const AnswerSchema = new Schema({
  question: String,
  answer: String,
  feedback: String,
  score: Number
});

const InterviewSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  description: String,
  experience: String,
  skills: [String],
  questions: [String],
  answers: [AnswerSchema],
  overallScore: Number,
  persona: { 
    type: String, 
    enum: ['male', 'female'] 
  }
}, { 
  timestamps: true 
});

// Export with model overwrite protection
export default models.Interview || model('Interview', InterviewSchema);