import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/db';
import Problem from '@/app/api/models/problem.model';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID parameter required" }, { status: 400 });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProblem);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "ID parameter required" }, { status: 400 });
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Data purged successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Purge sequence failed" }, { status: 500 });
  }
}