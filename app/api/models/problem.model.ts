import { Schema, model, models } from 'mongoose';

const ProblemSchema = new Schema({
  problemName: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  isRevisionRequired: { type: Boolean, default: false },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  note: { type: String, default: '' },
  code: {
    language: { type: String, default: '' },
    sourceCode: { type: String, default: '' }
  },
  problemUrl: { type: String, required: true },
}, { timestamps: true });

const Problem = models.Problem || model('Problem', ProblemSchema);
export default Problem;