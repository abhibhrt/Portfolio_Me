import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/db';
import Story from '../../models/story.model';
import { deleteFromCloud } from '../../lib/cloudinary';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  try {
    const stories = await Story.findById(id);

    if (!stories) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (stories.public_id) {
      await deleteFromCloud(stories.public_id);
    }

    await Story.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Story Trashed' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
