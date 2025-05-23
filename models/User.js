import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  image: String,
  interviews: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Interview' 
  }]
}, { 
  timestamps: true 
});

// Export with model overwrite protection
export default models.User || model('User', UserSchema);