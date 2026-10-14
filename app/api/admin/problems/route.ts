import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
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