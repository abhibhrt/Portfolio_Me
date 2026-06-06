import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../lib/db';
import Story from '../models/story.model';
import { uploadToCloud } from '../lib/cloudinary';

export const sizeLimit = '50mb'; 
export const maxDuration = 60;

// GET: Fetch all projects
export async function GET() {
    await connectDB();
    try {
        const stories = await Story.find({}).sort({ createdAt: -1 });
        return NextResponse.json(stories, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

// POST: Deploy new project (Supports Image and Video)
export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const formData = await req.formData();

        const file = formData.get('file') as File;
        const caption = formData.get('caption');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Upload file to Cloudinary
        const uploadRes = await uploadToCloud(file);

        // 2. Save to MongoDB
        const newStory = await Story.create({
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
            caption
        });

        return NextResponse.json(newStory, { status: 201 });
    } catch (error) {
        console.error("Server Error during upload:", error);
        return NextResponse.json({ 
            error: 'Deployment failed', 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}