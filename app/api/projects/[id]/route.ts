import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/db';
import Project from '../../models/project.model';
import { deleteFromCloud } from '../../lib/cloudinary';

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
