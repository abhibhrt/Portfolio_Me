import mongoose, { Schema, model, models } from 'mongoose';

const ProblemSchema = new Schema({
  problemName: { type: String, required: true },
  date: { type: String, required: true },
  platform: { type: String, enum: ['LeetCode', 'GFG', 'CodeStudio', 'Other'], default: 'LeetCode' },
  isRevisionRequired: { type: Boolean, default: false },
  note: { type: String, default: '' },
  problemUrl: { type: String, required: true },
}, { timestamps: true });

const Problem = models.Problem || model('Problem', ProblemSchema);
export default Problem;