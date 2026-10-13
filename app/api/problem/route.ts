// app/api/problems/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/db';
import Problem from '@/app/api/models/problem.model';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const problems = await Problem.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(problems);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch vault data" }, { status: 500 });
  }
}