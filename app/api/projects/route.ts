import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../lib/db';
import Project from '../models/project.model';
import { uploadToCloud } from '../lib/cloudinary';

// GET: Fetch all projects
export async function GET() {
    await connectDB();
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

// POST: Deploy new project
export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const formData = await req.formData();

        // Extracting all fields from formData
        const file = formData.get('file') as File;
        const title = formData.get('title');
        const features = formData.get('features');
        const description = formData.get('description');

        // New fields added here
        const github = formData.get('github');
        const visit = formData.get('visit');
        const projectDate = formData.get('projectDate');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Upload file to Cloudinary
        const uploadRes = await uploadToCloud(file);

        // 2. Save to MongoDB with all fields
        const newProject = await Project.create({
            title,
            features,
            description,
            github,
            visit,
            projectDate,
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: 'Deployment failed' }, { status: 500 });
    }
}