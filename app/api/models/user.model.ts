// app/api/models/user.model.ts
import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export const User = models.User || mongoose.model('User', UserSchema);