import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  interviews: [{ type: Schema.Types.ObjectId, ref: 'Interview' }]
}, { timestamps: true });

// Add index for faster queries
UserSchema.index({ email: 1 });

export default model('User', UserSchema);