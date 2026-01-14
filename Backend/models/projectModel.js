import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "project title is required"],
    trim: true,
    minlength: [3, "title must be at least 3 characters long"],
    maxlength: [100, "title cannot exceed 100 characters"]
  },
  github: {
    type: String,
    required: [true, "github link is required"],
    trim: true,
    match: [/^https?:\/\/(www\.)?github\.com\/.+/, "please provide a valid github url"]
  },
  visit: {
    type: String,
    required: [true, "visit link is required"],
    trim: true,
    match: [/^https?:\/\/.+/, "please provide a valid URL"]
  },
  description: {
    type: String,
    required: [true, "description is required"],
    trim: true,
    minlength: [10, "description must be at least 10 characters long"],
    maxlength: [2000, "description cannot exceed 2000 characters"]
  },
  date: {
    type: String,
    required: [true, "date is required"],
    trim: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"]
  },
  tags: {
    type: [String],
    required: [true, "at least one tag is required"],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "please provide at least one tag"
    }
  },
  images: [
    {
      url: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, "image url must be valid"]
      },
      publicId: {
        type: String,
        trim: true
      }
    }
  ]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;