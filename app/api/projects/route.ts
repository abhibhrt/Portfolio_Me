import { NextResponse } from 'next/server';
import { connectDB } from '../lib/db';
import Project from '../models/project.model';

export async function GET() {
    await connectDB();
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}