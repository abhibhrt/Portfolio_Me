import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    features: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String },
    github: { type: String },
    visit: { type: String },
    projectDate: { type: String },
}, {
    timestamps: true,
});

const Project = models.Project || model('Project', ProjectSchema);

export default Project;