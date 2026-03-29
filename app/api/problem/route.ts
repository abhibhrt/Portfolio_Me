import { NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/db';
import Problem from '@/app/api/models/problem.model';

export async function GET() {
  try {
    await connectDB();
    const problems = await Problem.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(problems);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch vault data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.problemName || !body.problemUrl || !body.date || !body.category) {
      return NextResponse.json({ message: "Payload incomplete" }, { status: 400 });
    }

    const newProblem = await Problem.create(body);
    return NextResponse.json(newProblem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Deployment failed" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
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

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

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