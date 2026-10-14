import { NextResponse } from 'next/server';
import { connectDB } from '../lib/db';
import Story from '../models/story.model';


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