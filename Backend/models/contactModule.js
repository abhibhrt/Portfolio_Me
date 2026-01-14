import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        minlength: [2, 'name must be at least 2 characters long'],
        maxlength: [100, 'name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'please provide a valid email address']
    },
    message: {
        type: String,
        required: [true, 'message is required'],
        trim: true,
        minlength: [5, 'message must be at least 5 characters long'],
        maxlength: [1000, 'message cannot exceed 1000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;