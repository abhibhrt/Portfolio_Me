import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/db';
import Problem from '@/app/api/models/problem.model';
import { generateRevisionNote } from '@/app/api/lib/gemini';

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

    const updateData: Record<string, any> = { ...body };

    if (body.status === 'Solved') {
      updateData.date = new Date();
    }

    const hasIncomingCode = body.code?.sourceCode && body.code.sourceCode.trim().length > 0;

    if (hasIncomingCode && !body.note) {
      const existingProblem = await Problem.findById(id).select('problemName code');

      if (!existingProblem) {
        return NextResponse.json({ message: "Problem not found" }, { status: 404 });
      }

      const problemName = body.problemName || existingProblem.problemName;
      const language = body.code?.language || existingProblem.code?.language || '';
      const sourceCode = body.code.sourceCode;

      try {
        updateData.note = await generateRevisionNote({
          problemName,
          language,
          sourceCode,
        });
      } catch (aiError) {
        console.error("Gemini revision note generation failed:", aiError);
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { $set: updateData },
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