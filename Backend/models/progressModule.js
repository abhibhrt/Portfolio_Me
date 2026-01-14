import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'category is required'],
        trim: true,
        minlength: [3, 'category must be at least 3 characters long'],
        maxlength: [50, 'category cannot exceed 50 characters']
    },
    status: {
        type: Number,
        required: [true, 'status is required'],
        enum: {
            values: [0, 1],
            message: 'status must be either 0 or 1'
        },
        default: 0
    },
    note: {
        type: String,
        trim: true,
        default: '',
        maxlength: [200, 'note cannot exceed 200 characters']
    },
    record: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return Array.isArray(v);
            },
            message: 'record must be an array of strings'
        }
    },
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0],
        match: [/^\d{4}-\d{2}-\d{2}$/, 'date must be in yyyy-mm-dd format']
    }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;