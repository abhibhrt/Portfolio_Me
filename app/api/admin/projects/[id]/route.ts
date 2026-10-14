import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/db';
import Project from '@/app/api/models/project.model';
import { uploadToCloud, deleteFromCloud } from '@/app/api/lib/cloudinary';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title');
    const features = formData.get('features');
    const description = formData.get('description');
    const github = formData.get('github');
    const visit = formData.get('visit');
    const projectDate = formData.get('projectDate');

    let updateData: any = {
      title,
      features,
      description,
      github,
      visit,
      projectDate,
    };

    // If a new file is uploaded, delete old cloud asset and upload new one
    if (file && typeof file === 'object' && file.size > 0) {
      if (project.public_id) {
        await deleteFromCloud(project.public_id);
      }
      const uploadRes = await uploadToCloud(file);
      updateData.url = uploadRes.secure_url;
      updateData.public_id = uploadRes.public_id;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (project.public_id) {
      await deleteFromCloud(project.public_id);
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Project purged' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}