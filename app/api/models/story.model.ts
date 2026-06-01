// app/api/models/story.model.ts
import mongoose, { Schema, models } from 'mongoose';

const StorySchema = new Schema(
    {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        caption: {type: String}
    },
    { timestamps: true }
);

const Story = models.Story || mongoose.model('Story', StorySchema);

export default Story;